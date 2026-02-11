import { Request, Response } from 'express'
import theatreRepository from '../../repositories/TheatreRepository'
import { theatreCreateSchema, TheatreCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'

async function createTheatreHandler(req: Request, res: Response) {
  const { name, city } = req.body as TheatreCreateInput

  try {
    const theatre = await theatreRepository.create({ name, city })
    res.status(201).json(theatre)
  } catch {
    res.status(400).send('Could not create theatre')
  }
}

const createTheatre = [validateSchema(theatreCreateSchema), createTheatreHandler]

export default createTheatre
