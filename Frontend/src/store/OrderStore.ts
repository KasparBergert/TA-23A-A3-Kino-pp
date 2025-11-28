import SeatDTO from '../../../shared/types/SeatDTO'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'

class OrderStore {
  private chosenShowtime: ShowtimeDTO
  private chosenSeats: SeatDTO[] = []

  setShowtime(showtime: ShowtimeDTO) {
    this.chosenShowtime = { ...showtime }
  }

  getShowtime() {
    return this.chosenShowtime
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
