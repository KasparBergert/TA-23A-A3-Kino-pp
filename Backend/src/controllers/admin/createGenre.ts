import { Request, Response } from 'express'
import { genreCreateSchema } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import prisma from '../../../db'

async function createGenreHandler(req: Request, res: Response) {
  try {
    const genre = await prisma.genre.create({
      data: { name: req.body.name },
    })
    return res.status(201).json(genre)
  } catch (error) {
    console.error(error)
    return res.status(400).send('Could not create genre')
  }
}

const createGenre = [validateSchema(genreCreateSchema), createGenreHandler]
export default createGenre
