import FilmDTO from '../../../shared/types/FilmDTO'
import SeatDTO from '../../../shared/types/SeatDTO'
import ShowtimeDTO from '../../../shared/types/ShowtimeDTO'
import { seatService } from '../entities/SeatService'

class OrderStore {
  //this should be recieved form the API
  private seat_prices: { type: string; price: number }[]

  private showtime: ShowtimeDTO | null = null
  private seats: SeatDTO[] = []
  private holdExpiresAt: number | null = null
  private orderId: string | null = null

  constructor() {
    this.loadFromStorage()
  }

  async getPayingPrice(): Promise<number> {
    //if seat_prices is not set yet
    if (typeof this.seat_prices !== 'object') {
      this.seat_prices = await seatService.getPrices()
    }

    const price = this.seats.reduce((acc, seat) => {
      console.log(this.seat_prices)
      for (const { type, price } of this.seat_prices) {
        if (type === seat.type) return acc + price
      }
      return acc
    }, 0)

    return price
  }

  setShowtime(showtime: ShowtimeDTO) {
    this.showtime = { ...showtime }
    this.seats = []
    this.startHold(15)
    this.persist()
  }

  getShowtime(): ShowtimeDTO | null {
    return this.showtime
  }

  getFilm(): FilmDTO | null {
    return this.showtime?.film ? this.showtime?.film : null
  }

  async setChosenSeats(seats_p: SeatDTO[]) {
    this.seats = seats_p
    this.persist()
  }

  getChosenSeats() {
    return this.seats
  }

  startHold(minutes: number) {
    this.holdExpiresAt = Date.now() + minutes * 60 * 1000
    this.persist()
  }

  getHoldExpiresAt(): number | null {
    return this.holdExpiresAt
  }

  isHoldExpired(): boolean {
    return this.holdExpiresAt !== null && Date.now() > this.holdExpiresAt
  }

  setOrderId(id: string | null) {
    this.orderId = id
    this.persist()
  }

  getOrderId(): string | null {
    return this.orderId
  }

  clear(options: { preserveOrderId?: boolean } = {}) {
    const { preserveOrderId = false } = options
    this.showtime = null
    this.seats = []
    this.holdExpiresAt = null
    if (!preserveOrderId) this.orderId = null
    localStorage.removeItem('orderStore')
    if (preserveOrderId && this.orderId) this.persist()
  }

  private persist() {
    try {
      const payload = {
        showtime: this.showtime,
        seats: this.seats,
        holdExpiresAt: this.holdExpiresAt,
        orderId: this.orderId,
      }
      localStorage.setItem('orderStore', JSON.stringify(payload))
    } catch (err) {
      console.warn('Persist orderStore failed', err)
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem('orderStore')
      if (!raw) return
      const parsed = JSON.parse(raw)
      this.showtime = parsed.showtime ?? null
      this.seats = parsed.seats ?? []
      this.holdExpiresAt = parsed.holdExpiresAt ?? null
      this.orderId = parsed.orderId ?? null
    } catch (err) {
      console.warn('Restore orderStore failed', err)
    }
  }
}

const orderStore = new OrderStore()
export default orderStore
