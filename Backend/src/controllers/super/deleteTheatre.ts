import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function deleteTheatre(req: Request, res: Response) {
  const id = Number(req.params.theatreId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    await prisma.theatre.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(404).send('Theatre not found')
  }
}
