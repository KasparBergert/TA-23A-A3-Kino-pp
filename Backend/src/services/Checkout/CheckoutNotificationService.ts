import mailer from '../../lib/mailer'

class CheckoutNotificationService {
  sendPaidOrderConfirmation(
    email: string,
    order: {
      id: bigint
      tickets: Array<{
        seatId: number
        seat: { row: string; column: number; type: string | null }
        showtime: {
          startsAt: Date
          film: { title: string }
          hall: { name: string; theatre: { name: string } }
        }
      }>
    },
  ): void {
    const first = order.tickets[0]
    if (!first) return

    const showtime = first.showtime

    mailer
      .sendReservationEmail({
        to: email,
        filmTitle: showtime.film.title,
        theatreName: showtime.hall.theatre.name,
        hallName: showtime.hall.name,
        datetime: new Date(showtime.startsAt).toLocaleString('et-EE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        seats: order.tickets.map((ticket) => ({
          id: ticket.seatId,
          row: String(ticket.seat.row),
          column: ticket.seat.column,
          type: ticket.seat.type ?? 'Standard',
        })),
        orderId: order.id.toString(),
      })
      .catch((err) => console.warn('[mailer] payOrder send failed', err))
  }

  sendReservationConfirmation(
    email: string,
    showtime: {
      startsAt: Date
      film: { title: string }
      hall: { name: string; theatre: { name: string } }
    },
    seats: Array<{ id: number; row: string; column: number; type: string | null }>,
    orderId: bigint,
  ): void {
    mailer
      .sendReservationEmail({
        to: email,
        filmTitle: showtime.film.title,
        theatreName: showtime.hall.theatre.name,
        hallName: showtime.hall.name,
        datetime: new Date(showtime.startsAt).toLocaleString('et-EE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        seats: seats.map((seat) => ({
          id: seat.id,
          row: String(seat.row),
          column: seat.column,
          type: seat.type ?? 'Standard',
        })),
        orderId: orderId.toString(),
      })
      .catch((err) => console.warn('[mailer] send failed', err))
  }
}

const checkoutNotificationService = new CheckoutNotificationService()
export default checkoutNotificationService
