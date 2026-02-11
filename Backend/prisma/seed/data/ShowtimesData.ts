import { showtime } from '@prisma/client'
import filmRepository from '../../../src/repositories/FilmRepository.ts'
import hallRepository from '../../../src/repositories/HallRepository.ts'
import theatreRepository from '../../../src/repositories/TheatreRepository.ts'

const OPEN_HOUR = 9
const CLOSE_HOUR = 22
const GAP_MIN = 60
const DEFAULT_DURATION = 120
const SHOWTIMES_PER_THEATRE = 5

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
    const hall = halls.find((h) => h.theatreId === theatre.id) || halls[0]
    if (!hall) return

    let cursor = new Date(today)
    cursor.setHours(OPEN_HOUR, 0, 0, 0)

    for (let i = 0; i < SHOWTIMES_PER_THEATRE; i++) {
      const film = films[(theatreIdx * SHOWTIMES_PER_THEATRE + i) % films.length]
      const duration = film.durationMin ?? DEFAULT_DURATION
      const startsAt = roundDownToFiveMinutes(new Date(cursor))
      const endsAt = addMinutes(startsAt, duration)
      showtimes.push({
        filmId: film.id,
        hallId: hall.id,
        startsAt,
        endsAt,
        isCanceled: false,
      })
      cursor = roundDownToFiveMinutes(addMinutes(endsAt, GAP_MIN))
      if (cursor.getHours() >= CLOSE_HOUR) break
    }
  })

  return showtimes
}
