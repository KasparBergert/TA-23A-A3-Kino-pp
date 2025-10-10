import { Connection } from 'mariadb/*'
import db from '../../../database/src/db'
import { Response } from 'express'

//gets all available theatres
export default async function getTheatres(req: Request, res: Response) {
  const theatres = db(async (db: Connection) => {
    try {
      return await db.execute('SELECT * from theatres')
    } catch (err) {
      console.error(err)
      return res.status(400).send({ code: 'VAL-0002' })
    }
  })

  //make into a list of names
  const result = []
  for (let theatre of await theatres) {
    result.push(theatre.name)
  }

  res.status(200).send({ code: 'VAL-0000', theatres: result })
}
