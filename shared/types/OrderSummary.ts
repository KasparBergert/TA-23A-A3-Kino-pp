export type OrderSummary = {
  id: string
  status: 'pending' | 'paid' | 'expired'
  createdAt: string
  showtimeId?: number
  film: { id: number; title: string } | null
  theatre: { id: number; name: string } | null
  hall: { id: number; name: string } | null
  startsAt?: string
  seats: number[]
}

export default OrderSummary
