import { Request, Response } from 'express'
import genreRepository from '../repositories/GenreRepositroy'

export default async function getGenres(_req: Request, res: Response) {
  try {
    const genres = await genreRepository.getAll()
    return res.status(200).json(genres)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Failed to load genres')
  }
}
