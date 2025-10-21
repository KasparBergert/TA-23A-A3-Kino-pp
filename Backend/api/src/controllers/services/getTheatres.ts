import prisma from '../../../../database/db'
import { Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {

  try{
    const theatres = await prisma.theatres.findMany()
    return res.status(200).send({ code: 'VAL-0000', theatres })
  }catch(err){
    return res.status(400).send({ code: 'VAL-0002' })
  }

}
