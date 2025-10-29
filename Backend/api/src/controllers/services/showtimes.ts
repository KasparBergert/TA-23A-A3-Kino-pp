import { Response } from 'express'
import prisma from '../../../../database/db'
import getFilmTitle from '../../../services/getfilmTitle'
import { toUSVString } from 'util'

//gets all available theatres
export default async function showtimes(req: Request, res: Response) {

  //filters
    /*
    - theatre id
      it should filter the showtimes based on the films in the theare
      it will only return everything about the showtime.
    */

    /*

    SELECT
    t.`name` AS theatre_name,
    f.title AS film_name,
    f.duration_min,
    f.poster_url,
    h.name AS hall_name,
    (h.capacity - count(s.id)) AS available_seats,
    price,
    starts_at,
    ends_at
    FROM
    showtimes st
    JOIN films f ON st.film_id = f.id
    JOIN halls h ON st.hall_id = h.id
    JOIN theatre_halls th ON th.hall_id = h.id
    JOIN theatres t ON t.id = th.theatre_id
    JOIN seats s ON s.hall_id = h.id
    GROUP BY film_name;

     */

      const showtimesUnparsed = await prisma.showtimes.findMany({
        select:{
         price: true,
         starts_at: true,
         ends_at: true,
          films: {
            select: {
              title: true,
              duration_min: true,
              poster_url: true
            }
          },
          halls: {
            select:{
              name: true,
              capacity: true
            }
          }
        },

      })





     {
      film: {
        title: "title",
        release_date: "date",
        poster_url: "URL",
        genres: ['here', 'there']
      },
      theatre: {
        id: 12,
        name: "name"
      },
      hall: {
        id: 12,
        name: "name"
        available_seats: 123
      },
      starts_at: (javascript date)
      ends_at: (javascript date)
    }

  res.status(400).send({ code: 'VAL-0001' })
}
