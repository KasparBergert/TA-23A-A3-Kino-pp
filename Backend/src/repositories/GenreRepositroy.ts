import { genre } from '@prisma/client'
import prisma from '../../db'

class GenreRepository {
  async getAll() {
    return await prisma.genre.findMany({})
  }

  async createMany(genre: Omit<genre, 'id'>[]) {
    await prisma.genre.createMany({
      data: genre,
      skipDuplicates: true,
    })
  }
}

const genreRepository = new GenreRepository()
export default genreRepository
