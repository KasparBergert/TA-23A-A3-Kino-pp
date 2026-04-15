import { Request, Response } from 'express'
import { theatreCreateSchema, TheatreCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import prisma from '../../../db'

async function updateTheatreHandler(req: Request, res: Response) {
  const id = Number(req.params.theatreId)
  const { name, city } = req.body as TheatreCreateInput
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    const theatre = await prisma.theatre.update({
      where: { id },
      data: { name, city },
    })
    res.json(theatre)
  } catch {
    res.status(404).send('Theatre not found')
  }
}

const updateTheatre = [validateSchema(theatreCreateSchema), updateTheatreHandler]

export default updateTheatre
