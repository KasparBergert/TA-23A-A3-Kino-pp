import client from '../utils/api'

export type AnalyticsOverview = {
  totalBookings: number
  bookingsPerMovie: { filmId: number; filmTitle: string; bookings: number }[]
  occupancy: {
    showtimeId: number
    filmTitle: string
    hallName: string
    occupancyPercent: number
    availableSeats: number
    totalSeats: number
  }[]
}

async function getOverview(): Promise<AnalyticsOverview> {
  return await client.get('/admin/analytics')
}

export const analyticsService = { getOverview }
