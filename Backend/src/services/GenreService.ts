import prisma from '../../db'
import type { genre } from '@prisma/client'
import type { GenreCreateInput } from '../dto/schemas'
import { BadRequestError, NotFoundError } from '../errors/HttpError'
import type { CRUDService } from './interface/CRUDService'

class GenreService implements CRUDService<genre, GenreCreateInput> {
  async get(): Promise<genre[]> {
    return await prisma.genre.findMany()
  }

  async create(data: GenreCreateInput): Promise<genre> {
    try {
      return await prisma.genre.create({
        data,
      })
    } catch {
      throw new BadRequestError('Could not create genre')
    }
  }

  async edit(id: number, data: GenreCreateInput): Promise<genre> {
    try {
      return await prisma.genre.update({
        where: { id },
        data,
      })
    } catch {
      throw new NotFoundError('Genre not found')
    }
  }

  async delete(id: number): Promise<genre> {
    try {
      return await prisma.genre.delete({ where: { id } })
    } catch {
      throw new NotFoundError('Genre not found')
    }
  }
}

const genreService = new GenreService()
export default genreService
