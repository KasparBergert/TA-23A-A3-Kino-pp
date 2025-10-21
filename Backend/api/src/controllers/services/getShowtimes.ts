import { Response } from 'express'
import prisma from '../../../../database/db'

//gets all available theatres
export default async function getShowtimes(req: Request, res: Response) {

  //filters
    /*
    - theatre id
      it should filter the showtimes based on the films in the theare
      it will only return everything about the showtime.
    */

  //what needs to be returned
    /**
     * title
     * img_url
     * available seats
     * theatre
     * time
     * film_name
     * genre
    */

  res.status(400).send({ code: '' })
}
