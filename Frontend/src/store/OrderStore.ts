import FilmDTO from '../../../shared/types/FilmDTO'
import SeatDTO from '../../../shared/types/SeatDTO'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'

class OrderStore {
  private chosenShowtime: ShowtimeDTO | null = null
  private chosenSeats: SeatDTO[] = []

  setShowtime(showtime: ShowtimeDTO) {
    this.chosenShowtime = { ...showtime }
  }

  getShowtime(): ShowtimeDTO | null {
    return this.chosenShowtime
  }

  getFilm(): FilmDTO | null {
    return this.chosenShowtime?.film
    ? this.chosenShowtime?.film
    : null;
  }

  setChosenSeats(seats: SeatDTO[]) {
    this.chosenSeats = seats.map((seat) => {
      return { ...seat }
    })
  }

  getChosenSeats() {
    return this.chosenSeats
  }
}

const orderStore = new OrderStore()
export default orderStore
