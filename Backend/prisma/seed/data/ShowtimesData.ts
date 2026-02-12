import { showtime } from '@prisma/client'
import filmRepository from '../../../src/repositories/FilmRepository.ts'
import hallRepository from '../../../src/repositories/HallRepository.ts'
import theatreRepository from '../../../src/repositories/TheatreRepository.ts'

const OPEN_HOUR = 9
const CLOSE_HOUR = 22
const GAP_MIN = 60
const GAP_MAX = 120
const DEFAULT_DURATION = 120
const SHOWTIMES_PER_THEATRE = 5
const DAYS_AHEAD = 14

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function roundDownToFiveMinutes(date: Date) {
  const rounded = new Date(date)
  const minutes = rounded.getMinutes()
  const floored = minutes - (minutes % 5)
  rounded.setMinutes(floored, 0, 0)
  return rounded
}

function maxCloseForDay(day: Date) {
  const d = new Date(day)
  d.setHours(CLOSE_HOUR, 0, 0, 0)
  return d
}

export async function createShowtimeSeed(): Promise<Omit<showtime, 'id'>[]> {
  const films = await filmRepository.getAll()
  const halls = await hallRepository.getAll()
  const theatres = await theatreRepository.getAll()

  if (!films.length) throw new Error('No films exist for showtimes')
  if (!halls.length) throw new Error('No halls exist for showtimes')
  if (!theatres.length) throw new Error('No theatres exist for showtimes')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const showtimes: Omit<showtime, 'id'>[] = []

  theatres.forEach((theatre, theatreIdx) => {
    const theatreHalls = halls.filter((h) => h.theatreId === theatre.id)
    const hallsCycle = theatreHalls.length ? theatreHalls : halls
    if (!hallsCycle.length) return

    for (let day = 0; day < DAYS_AHEAD; day++) {
      let cursor = new Date(today)
      cursor.setDate(cursor.getDate() + day)
      cursor.setHours(OPEN_HOUR, 0, 0, 0)
      const closing = maxCloseForDay(cursor)

      for (let i = 0; i < SHOWTIMES_PER_THEATRE; i++) {
        const film = films[(theatreIdx * SHOWTIMES_PER_THEATRE + i + day) % films.length]
        const hall = hallsCycle[(i + day) % hallsCycle.length]
        const duration = film.durationMin ?? DEFAULT_DURATION
        const startsAt = roundDownToFiveMinutes(new Date(cursor))
        const endsAt = addMinutes(startsAt, duration)
        if (endsAt > closing) break
        showtimes.push({
          filmId: film.id,
          hallId: hall.id,
          startsAt,
          endsAt,
          isCanceled: false,
        })
        const gap = GAP_MIN + Math.floor(Math.random() * (GAP_MAX - GAP_MIN + 1))
        cursor = roundDownToFiveMinutes(addMinutes(endsAt, gap))
        if (cursor.getHours() >= CLOSE_HOUR) break
      }
    }
  })

  // Ensure every film has at least one showtime
  const existingByFilm = new Set(showtimes.map((s) => s.filmId))
  const anchor = roundDownToFiveMinutes(new Date(today))
  anchor.setHours(12, 0, 0, 0)
  films.forEach((film, idx) => {
    if (existingByFilm.has(film.id)) return
    const hall = halls[idx % halls.length]
    const startsAt = roundDownToFiveMinutes(addMinutes(anchor, idx * 15))
    const endsAt = addMinutes(startsAt, film.durationMin ?? DEFAULT_DURATION)
    showtimes.push({
      filmId: film.id,
      hallId: hall.id,
      startsAt,
      endsAt,
      isCanceled: false,
    })
  })

  return showtimes
}
