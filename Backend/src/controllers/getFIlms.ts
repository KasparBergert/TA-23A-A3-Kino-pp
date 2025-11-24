import { Request, Response } from 'express'
import filmService from '../services/FilmService';

//gets all available theatres
export default async function getFIlms(req: Request, res: Response) {
  try {        
    const films = await filmService.getAll();
    return res.status(200).send({ films: films })
  } catch (err) {
    console.error(err)
    return res.status(400).send({ message: 'Failed to fetch films' })
  }
}
