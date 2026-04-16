import prisma from '../../db'
import { BadRequestError, NotFoundError } from '../errors/HttpError'
import type { film, hall } from '@prisma/client'

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

type AutoScheduleParams = {
  theatreId: number
  filmIds: number[]
  startDate: string
  endDate: string
  hallId?: number
}

type GeneratedShowtime = {
  filmId: number
  hallId: number
  startsAt: Date
  endsAt: Date
}

class AdminShowtimeService {
  async autoSchedule(params: AutoScheduleParams) {
    const { theatreId, filmIds, startDate, endDate, hallId } = params
    const { start, end } = this.parseDateRange(startDate, endDate)
    const halls = await this.getTheatreHalls(theatreId)
    const hallToUse = this.resolveHallId(halls, hallId)
    const films = await this.getFilmsOrThrow(filmIds)
    const showtimes = this.generateShowtimes(start, end, films, hallToUse)

    if (!showtimes.length) throw new BadRequestError('No showtimes could be generated with given range')

    await this.persistShowtimes(showtimes)

    return { created: showtimes.length }
  }
  
  async deleteById(id: number): Promise<void> {
    try {
      await prisma.showtime.delete({ where: { id } })
    } catch {
      throw new NotFoundError('Showtime not found')
    }
  }

  private parseDateRange(startDate: string, endDate: string): { start: Date; end: Date } {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      throw new BadRequestError('startDate must be before endDate')
    }

    return { start, end }
  }

  private async getTheatreHalls(theatreId: number): Promise<hall[]> {
    const halls = await prisma.hall.findMany({
      where: { theatreId },
      orderBy: { id: 'asc' },
    })

    if (!halls.length) {
      throw new BadRequestError('Selected cinema has no halls')
    }

    return halls
  }

  private resolveHallId(halls: hall[], requestedHallId?: number): number {
    const hallToUse = requestedHallId ?? halls[0].id

    if (requestedHallId && !halls.some((hall) => hall.id === requestedHallId)) {
      throw new BadRequestError('Hall does not belong to selected cinema')
    }

    return hallToUse
  }

  private async getFilmsOrThrow(filmIds: number[]): Promise<film[]> {
    const films = await prisma.film.findMany({
      where: { id: { in: filmIds } },
    })

    if (!films.length) {
      throw new BadRequestError('No films found for the provided ids')
    }

    return films
  }

  private generateShowtimes(
    start: Date,
    end: Date,
    films: film[],
    hallId: number,
  ): GeneratedShowtime[] {
    const showtimes: GeneratedShowtime[] = []

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

        showtimes.push({ filmId: film.id, hallId, startsAt, endsAt })
        const gap =
          MIN_GAP_MINUTES + Math.floor(Math.random() * (MAX_GAP_MINUTES - MIN_GAP_MINUTES + 1))
        cursor = roundDownToFiveMinutes(addMinutes(endsAt, gap))
        filmIndex += 1
      }
    }

    return showtimes
  }

  private async persistShowtimes(showtimes: GeneratedShowtime[]): Promise<void> {
    await prisma.showtime.createMany({
      data: showtimes,
      skipDuplicates: true,
    })
  }
}

const adminShowtimeService = new AdminShowtimeService()
export default adminShowtimeService
