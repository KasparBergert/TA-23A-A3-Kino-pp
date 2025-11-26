import ShowtimeFilters from '../../../shared/types/ShowtimeFilter'
import client from '../utils/api'

class ShowtimeService {

  private buildUrl(filters: ShowtimeFilters){
    return Object.entries(filters).map((key, val) => {
      return `${key}=${val}&`
    })
  }

  async getShowtimes(filters: ShowtimeFilters) {
    return await client.get(`/showtimes?${this.buildUrl(filters)}`)
  }
}

const showtimeService = new ShowtimeService()
export default showtimeService
