import { review } from '@prisma/client'
import filmRepository from '../../../src/repositories/FilmRepository'
import { getRandom } from '../utils/fetch'

const sampleReviews = [
  { author: 'Cinema Critic', rating: 5, comment: 'A must-watch on the big screen.' },
  { author: 'Movie Buff', rating: 4, comment: 'Great pacing and visuals.' },
  { author: 'Viewer', rating: 3, comment: 'Good, but a bit long in the middle.' },
]

export async function createReviewsSeed(): Promise<Omit<review, 'id' | 'createdAt'>[]> {
  const films = await filmRepository.getAll()
  if (!films.length) return []
  return films.slice(0, 10).map((film, idx) => {
    const pick = getRandom(sampleReviews)
    return {
      filmId: film.id,
      author: `${pick.author} #${idx + 1}`,
      rating: pick.rating,
      comment: pick.comment,
    }
  })
}
