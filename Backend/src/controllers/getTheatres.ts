import theatreService from '../services/TheatreService';
import { Request, Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  try {
    const query = req.query
    //check if request has theatre_id
    const theatre_id = Number(query.theatre_id);
    if (!Number.isNaN(theatre_id)) {
      const theatre = await theatreService.getById(theatre_id)
      return res.status(200).send({ theatre })
    }else if(theatre_id){
      return res.status(400).send(`Invalid theatre_id ${typeof theatre_id} instead of number`)
    }

    const theatres = await theatreService.getAll()
    return res.status(200).send({ theatres })
  } catch (err) {
    console.error(err)
    return res.status(400).send(`Error occured fetching theatres. \n${err}`)
  }
}
