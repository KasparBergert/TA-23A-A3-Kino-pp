import { Connection } from 'mariadb/*'
import db from '../../../database/db'
import { Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  const theatres = await db(async (db: Connection) => {
    try {
      return await db.execute('SELECT * from theatres')
    } catch (err) {
      console.error(err)
      return res.status(400).send({ code: 'VAL-0002' })
    }
  })


  res.status(200).send({ code: 'VAL-0000', theatres })
}
