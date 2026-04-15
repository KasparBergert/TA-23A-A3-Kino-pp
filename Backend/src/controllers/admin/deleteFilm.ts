import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function deleteFilm(req: Request, res: Response) {
  const id = Number(req.params.filmId)
  if (Number.isNaN(id)) return res.status(400).send('Invalid id')

  try {
    await prisma.film.delete({ where: { id } })
    res.status(204).send()
  } catch {
    res.status(404).send('Film not found')
  }
}
