import FilmDTO from './FilmDTO'
interface ShowtimeDTO {
  id: number
  ends_at: Date | null
  is_canceled: boolean
  starts_at: Date

  film: FilmDTO

  hall: {
    id: number
    name: string
    capacity: number
  }

  theatre: {
    id: number
    name: string
  }
}

export default ShowtimeDTO
