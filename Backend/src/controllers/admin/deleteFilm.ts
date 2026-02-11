import { Request, Response } from 'express'
import filmRepository from '../../repositories/FilmRepository'

export default async function deleteFilm(req: Request, res: Response) {
  const id = Number(req.params.filmId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    await filmRepository.delete(id)
    res.status(204).send()
  } catch {
    res.status(404).send('Film not found')
  }
}
