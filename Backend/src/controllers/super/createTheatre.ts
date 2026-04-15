import { Request, Response } from 'express'
import { theatreCreateSchema, TheatreCreateInput } from '../../dto/schemas'
import { validateSchema } from '../middleware/validateSchema'
import prisma from '../../../db'

async function createTheatreHandler(req: Request, res: Response) {
  const { name, city } = req.body as TheatreCreateInput

  try {
    const theatre = await prisma.theatre.create({
      data: { name, city },
    })
    res.status(201).json(theatre)
  } catch {
    res.status(400).send('Could not create theatre')
  }
}

const createTheatre = [validateSchema(theatreCreateSchema), createTheatreHandler]

export default createTheatre
