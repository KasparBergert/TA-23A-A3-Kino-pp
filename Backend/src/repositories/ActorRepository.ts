import prisma from '../../db'
import type ActorDTO from '../../../shared/types/ActorDTO'

class ActorRepository {
  async getByFilmId(film_id: number): Promise<ActorDTO[]> {
    const rows = (await prisma.$queryRaw`
      SELECT id, name, film_id, link, image_url
      FROM actors
      WHERE film_id = ${film_id}
    `) as Array<{
      id: bigint
      name: string
      film_id: bigint
      link: string | null
      image_url: string | null
    }>

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      film_id: Number(row.film_id),
      link: row.link,
      image_url: row.image_url,
    }))
  }
}

const actorRepository = new ActorRepository()
export default actorRepository
