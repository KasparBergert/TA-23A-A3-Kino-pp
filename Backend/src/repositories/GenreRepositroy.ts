import { genres } from '@prisma/client'
import prisma from '../../db'

class GenreRepository {
  async getAll() {
    return await prisma.genres.findMany({})
  }

  async createMany(genres: Omit<genres, 'id'>[]) {
    await prisma.genres.createMany({
      data: genres,
      skipDuplicates: true,
    })
  }
}

const genreRepository = new GenreRepository()
export default genreRepository
