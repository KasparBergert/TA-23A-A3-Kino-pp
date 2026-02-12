import client from '../utils/api'

type ReservationPayload = {
  showtimeId: number
  seatIds: number[]
  email: string
}

type ReservationResponse = {
  orderId: string
  reservedSeats: number[]
  email: string
  expiresAt: string
  notice: string
}

type CancelPayload = { orderId: string }

type CancelResponse = { canceled: boolean }

async function reserve(payload: ReservationPayload): Promise<ReservationResponse> {
  return client.post('/checkout/mock', payload)
}

async function cancel(payload: CancelPayload): Promise<CancelResponse> {
  return client.post('/checkout/cancel', payload)
}

export const bookingService = {
  reserve,
  cancel,
}
