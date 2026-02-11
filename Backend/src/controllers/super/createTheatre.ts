import { Request, Response } from 'express'
import theatreRepository from '../../repositories/TheatreRepository'

export default async function createTheatre(req: Request, res: Response) {
  const { name } = req.body
  if (!name) return res.status(400).send('Missing name')

  try {
    const theatre = await theatreRepository.create({ name })
    res.status(201).json(theatre)
  } catch {
    res.status(400).send('Could not create theatre')
  }
}
