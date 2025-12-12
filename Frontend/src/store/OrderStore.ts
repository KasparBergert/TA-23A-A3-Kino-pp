import FilmDTO from '../../../shared/types/FilmDTO'
import SeatDTO from '../../../shared/types/SeatDTO'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'

class OrderStore {
  private showtime: ShowtimeDTO | null = null
  private seat_ids: number[] = []

  setShowtime(showtime: ShowtimeDTO) {
    this.showtime = { ...showtime }
  }

  getShowtime(): ShowtimeDTO | null {
    return this.showtime
  }

  getFilm(): FilmDTO | null {
    return this.showtime?.film
    ? this.showtime?.film
    : null;
  }

  setChosenSeats(seat_ids_p: number[]) {
    this.seat_ids = seat_ids_p;
  }

  getChosenSeats() {
    return this.seat_ids
  }
}

const orderStore = new OrderStore()
export default orderStore
