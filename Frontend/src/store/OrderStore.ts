import FilmDTO from '../../../shared/types/FilmDTO'
import SeatDTO from '../../../shared/types/SeatDTO'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'
import { seatService } from '../entities/SeatService'

class OrderStore {
  //this should be receved form an API
  private seat_prices: { type: string; price: number }[]

  private showtime: ShowtimeDTO | null = null
  private seats: SeatDTO[] = []
  private paying_price: number = 0

  async getPayingPrice(): Promise<number> {
    //if seat_prices is not set yet
    if (typeof this.seat_prices !== 'object') {
      this.seat_prices = await seatService.getPrices()
    }

    let sum = 0
    for (const { type, price } of this.seat_prices) {
      //add each seat type price sum to total sum
      sum += this.seats.reduce((acc, seat) => {
        if (type === seat.type) {
          return acc + price
        }
        return acc
      }, 0)
    }
    return sum
  }

  setShowtime(showtime: ShowtimeDTO) {
    this.showtime = { ...showtime }
  }

  getShowtime(): ShowtimeDTO | null {
    return this.showtime
  }

  getFilm(): FilmDTO | null {
    return this.showtime?.film ? this.showtime?.film : null
  }

  async setChosenSeats(seats_p: SeatDTO[]) {
    this.seats = seats_p
  }

  getChosenSeats() {
    return this.seats
  }
}

const orderStore = new OrderStore()
export default orderStore
