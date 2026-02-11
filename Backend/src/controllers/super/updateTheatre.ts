import { Request, Response } from 'express'
import theatreRepository from '../../repositories/TheatreRepository'

export default async function updateTheatre(req: Request, res: Response) {
  const id = Number(req.params.theatreId)
  const { name } = req.body
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')
  if (!name) return res.status(400).send('Missing name')

  try {
    const theatre = await theatreRepository.update(id, { name })
    res.json(theatre)
  } catch {
    res.status(404).send('Theatre not found')
  }
}
