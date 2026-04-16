import type { genre } from '@prisma/client'
import type { GenreCreateInput } from '../dto/schemas'
import genreService from '../services/GenreService'
import ResourceController from './ResourceController'

const genreController = new ResourceController<genre, GenreCreateInput>(genreService, 'genreId', {
  deleteReturnsBody: true,
})

export default genreController
