import { Request, Response } from 'express'
import genreRepository from '../../repositories/GenreRepositroy'
import { genreUpdateSchema } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'

async function updateGenreHandler(req: Request, res: Response) {
  const id = Number(req.params.genreId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    const genre = await genreRepository.update(id, { name: req.body.name })
    return res.json(genre)
  } catch (error) {
    console.error(error)
    return res.status(404).send('Genre not found')
  }
}

const updateGenre = [validateSchema(genreUpdateSchema), updateGenreHandler]
export default updateGenre
