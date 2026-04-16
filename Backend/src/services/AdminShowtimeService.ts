import prisma from '../../db'
import { BadRequestError, NotFoundError } from '../errors/HttpError'

const MIN_OPEN_HOUR = 9
const MAX_OPEN_HOUR = 22
const MIN_GAP_MINUTES = 60
const MAX_GAP_MINUTES = 120
const DEFAULT_DURATION = 120

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

function sameDay(date: Date) {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

function maxCloseForDay(day: Date) {
  const close = new Date(day)
  close.setHours(MAX_OPEN_HOUR, 0, 0, 0)
  return close
}

class AdminShowtimeService {
  async autoSchedule(params: {
    theatreId: number
    filmIds: number[]
    startDate: string
    endDate: string
    hallId?: number
  }) {
    const { theatreId, filmIds, startDate, endDate, hallId } = params
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) throw new BadRequestError('startDate must be before endDate')

    const halls = await prisma.hall.findMany({
      where: { theatreId },
      orderBy: { id: 'asc' },
    })
    if (!halls.length) throw new BadRequestError('Selected cinema has no halls')

    const hallToUse = hallId ?? halls[0].id
    if (hallId && !halls.some((hall) => hall.id === hallId)) {
      throw new BadRequestError('Hall does not belong to selected cinema')
    }

    const films = await prisma.film.findMany({
      where: { id: { in: filmIds } },
    })
    if (!films.length) throw new BadRequestError('No films found for the provided ids')

    const showtimes: { filmId: number; hallId: number; startsAt: Date; endsAt: Date }[] = []

    for (let day = sameDay(start); day <= end; day.setDate(day.getDate() + 1)) {
      let cursor = new Date(day)
      cursor.setHours(MIN_OPEN_HOUR, 0, 0, 0)

      let filmIndex = 0
      const closing = maxCloseForDay(day)

      while (cursor < closing) {
        const film = films[filmIndex % films.length]
        const duration = film.durationMin ?? DEFAULT_DURATION
        const startsAt = roundDownToFiveMinutes(new Date(cursor))
        const endsAt = addMinutes(startsAt, duration)

        if (endsAt > closing) break

        showtimes.push({ filmId: film.id, hallId: hallToUse, startsAt, endsAt })
        const gap =
          MIN_GAP_MINUTES + Math.floor(Math.random() * (MAX_GAP_MINUTES - MIN_GAP_MINUTES + 1))
        cursor = roundDownToFiveMinutes(addMinutes(endsAt, gap))
        filmIndex += 1
      }
    }

    if (!showtimes.length) throw new BadRequestError('No showtimes could be generated with given range')

    await prisma.showtime.createMany({
      data: showtimes,
      skipDuplicates: true,
    })

    return { created: showtimes.length }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await prisma.showtime.delete({ where: { id } })
    } catch {
      throw new NotFoundError('Showtime not found')
    }
  }
}

const adminShowtimeService = new AdminShowtimeService()
export default adminShowtimeService
