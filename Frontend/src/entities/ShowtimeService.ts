import ShowtimeFilters from '../../../shared/types/ShowtimeFilter'
import { objectToQueryFields } from '../utils/objectToQueryFields'
import client from '../utils/api'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'


async function get(filters: ShowtimeFilters): Promise<ShowtimeDTO[]> {
  return await client.get(`/showtimes?${objectToQueryFields(filters)}`)
}

export const showtimeService = {
  get
}
