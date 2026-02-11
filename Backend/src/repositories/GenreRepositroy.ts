import { genre } from '@prisma/client'
import prisma from '../../db'

class GenreRepository {
  async getAll() {
    return await prisma.genre.findMany({})
  }

  async getById(id: number): Promise<genre | null> {
    return await prisma.genre.findUnique({ where: { id } })
  }

  async getByIds(ids: number[]): Promise<genre[]> {
    return await prisma.genre.findMany({ where: { id: { in: ids } } })
  }

  async createMany(genre: Omit<genre, 'id'>[]) {
    await prisma.genre.createMany({
      data: genre,
      skipDuplicates: true,
    })
  }

  async create(data: Omit<genre, 'id'>): Promise<genre> {
    return await prisma.genre.create({ data })
  }

  async update(id: number, data: Partial<Omit<genre, 'id'>>): Promise<genre> {
    return await prisma.genre.update({ where: { id }, data })
  }

  async delete(id: number): Promise<genre> {
    return await prisma.genre.delete({ where: { id } })
  }
}

const genreRepository = new GenreRepository()
export default genreRepository
