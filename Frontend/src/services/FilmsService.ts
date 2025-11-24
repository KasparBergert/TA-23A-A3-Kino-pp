import client from '../utils/api'


class FilmsService {
  async getAllFilms(): Promise<any> {
    return await client.get('/films')
  }
}

const filmsService = new FilmsService()
export default filmsService
