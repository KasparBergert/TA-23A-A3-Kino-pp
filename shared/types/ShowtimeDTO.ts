import FilmDTO from './FilmDTO'
import HallDTO from './HallDTO'
import TheatresDTO from './TheatreDTO'

interface ShowtimeDTO {
  id: number
  endsAt: Date
  isCanceled: boolean
  startsAt: Date
  film: FilmDTO
  hall: Omit<HallDTO, 'theatreId'>
  theatre: TheatresDTO
  stats: {
    totalSeats: number
    availableSeats: number
    occupancyPercent: number
  }
}


export default ShowtimeDTO
