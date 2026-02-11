import { Request, Response } from 'express'
import genreRepository from '../../repositories/GenreRepositroy'

export default async function deleteGenre(req: Request, res: Response) {
  const id = Number(req.params.genreId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    const deleted = await genreRepository.delete(id)
    return res.json(deleted)
  } catch (error) {
    console.error(error)
    return res.status(404).send('Genre not found')
  }
}
