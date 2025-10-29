import { Response } from 'express'
import prisma from '../../../../database/db'
import getFilmTitle from '../../../services/getfilmTitle'

//gets all available theatres
export default async function showtimes(req: Request, res: Response) {

  //filters
    /*
    - theatre id
      it should filter the showtimes based on the films in the theare
      it will only return everything about the showtime.
    */


    getall films


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
