import client from '../utils/api'


class TheatreService {
  async getAllTheatres(): Promise<any> {
    return await client.get('/theatres')
  }

  async getTheatreDetails(theatre_id: number){
    return await client.get(`/theatres?theatre_id=${theatre_id}`)
  }
}

const theatreService = new TheatreService();
export default theatreService
