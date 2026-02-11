import prisma from '../../db'
import type { review } from '@prisma/client'

class ReviewRepository {
  async getByFilmId(filmId: number): Promise<review[]> {
    return await prisma.review.findMany({
      where: { filmId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createMany(reviews: Omit<review, 'id'>[]) {
    await prisma.review.createMany({ data: reviews, skipDuplicates: true })
  }
}

const reviewRepository = new ReviewRepository()
export default reviewRepository
