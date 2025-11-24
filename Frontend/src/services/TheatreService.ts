import client from '../utils/api'


class TheatreService {
  async getAllTheatres(): Promise<any> {
    return await client.get('/theatres')
  }
}

const theatreService = new TheatreService();
export default theatreService
