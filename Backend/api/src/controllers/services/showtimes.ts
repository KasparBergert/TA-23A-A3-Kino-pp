import prisma from '../../../../database/db'
import { Request, Response } from 'express'

interface Filters {
  film_id: undefined | number
  theatre_id: undefined | number
}

//gets all available theatres
export default async function showtimes(req: Request, res: Response) {
  try {
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

    //if no theatres have been given, receive all theatres
    //get all theatres
    const theatreIds = halls.map((h) => h.theatre_id)
    const theatres = await prisma.theatres.findMany({
      where: { id: { in: theatreIds } },
      select: { id: true, name: true },
    })

    const filter: Filters = req.body;
    const showtimesFull = showtimes.map((st) => {
      const film = films.find((f) => f.id === st.film_id) // if film_id is set, it filters the showtimes based on that.
      const hall = halls.find((h) => h.id === st.hall_id)
      const hallSeats = seats.filter((s) => s.hall_id === hall?.id)
      const theatre = theatres.find((t) => t.id === hall?.theatre_id);

      return {
        price: st.price,
        starts_at: st.starts_at,
        ends_at: st.ends_at,
        film,
        hall: {
          name: hall?.name,
          available_seats: hallSeats.reduce((acc, seat) => (acc += seat.is_available), 0),
        },
        theatre_id: theatre?.id,
        theatre_name: theatre ? theatre.name : null,
      }
    })
    //find showtimes based on filters
    .filter(st => ((filter.film_id ? filter.film_id === st.film?.id : true)
     && (filter.theatre_id ? filter.theatre_id === st.theatre_id : true)))

    res.status(200).send({ code: 'VAL-0000', showtimes: showtimesFull })
  } catch (err) {
    console.error(err)
    res.status(400).send({ code: 'VAL-0002', message: 'Failed to fetch showtimes' })
  }
}
