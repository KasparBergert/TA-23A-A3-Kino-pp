import prisma from '../../../../database/db'
import { Request, Response } from 'express'

//gets all available theatres
export default async function theatres(req: Request, res: Response) {
  try {
    const theatres = await prisma.theatres.findMany()
    return res.status(200).send({ theatres })
  } catch (err) {
    console.error(err)
    return res.status(400).send('Error occured fetching theatres')
  }
}
