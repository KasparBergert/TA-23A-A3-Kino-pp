import { showtimes } from '@prisma/client'
import { getRandomFilm, getRandomHall } from '../utils/fetch'

export const showtimeSeed: Omit<showtimes, 'id'>[] = [
  {
    film_id: getRandomFilm().id,
    hall_id: getRandomHall().id,
    starts_at: new Date('2025-11-01T18:00:00'),
    ends_at: new Date('2025-11-01T20:00:00'),
    is_canceled: false
  },
  {
    film_id: getRandomFilm().id,
    hall_id: getRandomHall().id,
    starts_at: new Date('2025-11-01T20:30:00'),
    ends_at: new Date('2025-11-01T22:45:00'),
    is_canceled: false
  },
]
