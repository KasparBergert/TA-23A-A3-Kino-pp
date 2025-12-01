import ShowtimeFilters from '../../../shared/types/ShowtimeFilter'
import { objectToQueryFields } from '../utils/objectToQueryFields'
import client from '../utils/api'


async function getShowtimes(filters: ShowtimeFilters) {
  return await client.get(`/showtimes?${objectToQueryFields(filters)}`)
}

export const showtimeService = {
  getShowtimes
}
