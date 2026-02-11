import { Request, Response } from 'express'
import showtimeRepository from '../../repositories/ShowtimeRepository'

export default async function deleteShowtime(req: Request, res: Response) {
  const id = Number(req.params.showtimeId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    await showtimeRepository.delete(id)
    res.status(204).send()
  } catch (err) {
    res.status(404).send('Showtime not found')
  }
}
