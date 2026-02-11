import { Request, Response } from 'express'
import theatreRepository from '../../repositories/TheatreRepository'

export default async function deleteTheatre(req: Request, res: Response) {
  const id = Number(req.params.theatreId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    await theatreRepository.delete(id)
    res.status(204).send()
  } catch {
    res.status(404).send('Theatre not found')
  }
}
