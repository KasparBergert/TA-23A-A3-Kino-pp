import type ShowtimeFilters from '../../../shared/types/ShowtimeFilter.ts'
import prisma from '../../db.ts'

//filter layer
class ShowtimeFilter {
  /**
   * @param filters - object of filters
   * @returns prisma where object with filters inside it.
   */
  async build(filters: ShowtimeFilters): Promise<{where: Object}> {
    //TODO: Must build a check for user input here.

    const where: any = {}
    //NOTE:
    //the text in between the ['...'] must match the real prisma model field name
    if (filters.filmId) {
      where['filmId'] = Number(filters.filmId)
    }

    if (filters.theatreId) {
      //returns hall_ids with the theatreId so the prisma queries can filter with where
      const hallIds = await prisma.hall
        .findMany({
          where: { theatreId: Number(filters.theatreId) },
          select: { id: true },
        })
        .then((halls) => halls.map((h) => h.id))

      where['hallId'] = { in: hallIds }
    }

    if (filters.hallId) {
      (where['hallId'] ??= { in: [] }).in.push(filters.hallId);
    }

    if (filters.showtimeId) {
      where['id'] = Number(filters.showtimeId);
    }


    return where
  }
}

const showtimeFilter = new ShowtimeFilter()
export default showtimeFilter
