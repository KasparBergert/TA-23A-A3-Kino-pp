import type ShowtimeFilters from '../../types/ShowtimeFilter.ts'
import prisma from '../../db.ts'

//filter layer
class ShowtimeFilter {
  /**
   * @param filters - object of filters
   * @returns prisma where object with filters inside it.
   */
  async build(filters: ShowtimeFilters) {
    const where: any = {}
    //NOTE:
    //the text in between the ['...'] must match the real prisma model field name
    if (filters.film_id) {
      where['film_id'] = Number(filters.film_id)
    }

    if (filters.theatre_id) {
      //returns hall_ids with the theatre_id so the prisma queries can filter with where
      const hall_ids = await prisma.halls
        .findMany({
          where: { theatre_id: Number(filters.theatre_id) },
          select: { id: true },
        })
        .then((halls) => halls.map((h) => h.id))

      where['hall_id'] = { in: hall_ids }
    }

    return where
  }
}

const showtimeFilter = new ShowtimeFilter()
export default showtimeFilter
