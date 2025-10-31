import prisma from '../../../../database/db'
import { Request, Response } from 'express'

//gets all available theatres
export default async function showtimes(req: Request, res: Response) {
  const showtimes = await prisma.showtimes.findMany({
    select: {
      id: true,
      price: true,
      starts_at: true,
      ends_at: true,
      film_id: true,
      hall_id: true,
    },
  })

  const filmIds = showtimes.map((st) => st.film_id)
  const films = await prisma.films.findMany({
    where: { id: { in: filmIds } },
    select: {
      id: true,
      title: true,
      duration_min: true,
      poster_url: true,
    },
  })

  const hallIds = showtimes.map((st) => st.hall_id)
  const halls = await prisma.halls.findMany({
    where: { id: { in: hallIds } },
    select: {
      id: true,
      name: true,
      theatre_id: true,
    },
  })

  const seats = await prisma.seats.findMany({
    where: { hall_id: { in: hallIds } },
    select: {
      id: true,
      hall_id: true,
      is_available: true,
    },
  })

  const theatreIds = halls.map((h) => h.theatre_id)
  const theatres = await prisma.theatres.findMany({
    where: { id: { in: theatreIds } },
    select: { id: true, name: true },
  })

  const showtimesFull = showtimes.map((st) => {
    const film = films.find((f) => f.id === st.film_id)
    const hall = halls.find((h) => h.id === st.hall_id)
    const hallSeats = seats.filter((s) => s.hall_id === hall?.id)
    const theatre = theatres.find((t) => t.id === hall?.theatre_id)

    return {
      price: st.price,
      starts_at: st.starts_at,
      ends_at: st.ends_at,
      films: film,
      halls: {
        name: hall?.name,
        available_seats: hallSeats.reduce((acc, seat) => (acc += seat.is_available), 0),
      },
      theatre_name: theatre ? theatre.name : null,
    }
  })

  res.status(400).send({ code: 'VAL-0000', showtimesFull })
}
