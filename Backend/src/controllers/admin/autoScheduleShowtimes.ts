import { Request, Response } from 'express'
import { autoScheduleSchema } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import prisma from '../../../db'

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
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function maxCloseForDay(day: Date) {
  const d = new Date(day)
  d.setHours(MAX_OPEN_HOUR, 0, 0, 0)
  return d
}

async function autoScheduleHandler(req: Request, res: Response) {
  const { theatreId, filmIds, startDate, endDate, hallId } = req.body

  const start = new Date(startDate)
  const end = new Date(endDate)
  if (start > end) return res.status(400).send('startDate must be before endDate')

  const halls = await prisma.hall.findMany({
    where: { theatreId },
    orderBy: { id: 'asc' },
  })
  if (!halls.length) return res.status(400).send('Selected cinema has no halls')
  const hallToUse =
    hallId ??
    halls[0].id

  if (hallId && !halls.some((h) => h.id === hallId)) {
    return res.status(400).send('Hall does not belong to selected cinema')
  }

  const films = await prisma.film.findMany({
    where: { id: { in: filmIds } },
  })
  if (!films.length) return res.status(400).send('No films found for the provided ids')

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
      const gap = MIN_GAP_MINUTES + Math.floor(Math.random() * (MAX_GAP_MINUTES - MIN_GAP_MINUTES + 1))
      cursor = roundDownToFiveMinutes(addMinutes(endsAt, gap))
      filmIndex += 1
    }
  }

  if (!showtimes.length) return res.status(400).send('No showtimes could be generated with given range')

  await prisma.showtime.createMany({
    data: showtimes,
    skipDuplicates: true,
  })
  return res.status(201).json({ created: showtimes.length })
}

const autoScheduleShowtimes = [validateSchema(autoScheduleSchema), autoScheduleHandler]

export default autoScheduleShowtimes
