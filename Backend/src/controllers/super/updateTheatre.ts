import { Request, Response } from 'express'
import theatreRepository from '../../repositories/TheatreRepository'
import { theatreCreateSchema, TheatreCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'

async function updateTheatreHandler(req: Request, res: Response) {
  const id = Number(req.params.theatreId)
  const { name, city } = req.body as TheatreCreateInput
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    const theatre = await theatreRepository.update(id, { name, city })
    res.json(theatre)
  } catch {
    res.status(404).send('Theatre not found')
  }
}

const updateTheatre = [validateSchema(theatreCreateSchema), updateTheatreHandler]

export default updateTheatre
