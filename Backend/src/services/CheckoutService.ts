import prisma from '../../db'
import mailer from '../lib/mailer'
import { BadRequestError, ConflictError, NotFoundError } from '../errors/HttpError'
import { calcPricePerSeat } from '../utils/pricing'

class CheckoutService {
  async createReservation(params: { showtimeId: number; seatIds: number[]; email?: string }) {
    const { showtimeId, seatIds, email: rawEmail } = params

    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      throw new BadRequestError('showtimeId and seatIds are required')
    }
    if (seatIds.length > 10) {
      throw new BadRequestError('Maksimaalselt 10 kohta korraga')
    }

    const email = (rawEmail ?? '').trim()
    if (!email || email.length < 3) {
      throw new BadRequestError('valid email required')
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: Number(showtimeId) },
      include: { film: true, hall: { include: { theatre: true } } },
    })
    if (!showtime) throw new NotFoundError('Showtime not found')

    const now = new Date()
    await this.releaseExpiredReservations(showtime.id, now)

    const numericSeatIds = seatIds.map(Number)
    const seats = await prisma.seat.findMany({
      where: { id: { in: numericSeatIds }, hallId: showtime.hallId },
    })
    if (seats.length !== seatIds.length) throw new BadRequestError('Some seats do not belong to this hall')

    const existing = await prisma.ticket.findMany({
      where: {
        showtimeId: showtime.id,
        seatId: { in: numericSeatIds },
        OR: [
          { order: { status: 'paid' } },
          { order: { status: 'pending', OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] } },
        ],
      },
    })
    if (existing.length) throw new ConflictError('Some seats already booked')

    const holdUntil = new Date(now.getTime() + 15 * 60 * 1000)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, password: 'temporary', role: 'user' },
    })

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'pending',
        expiresAt: holdUntil,
      },
    })

    const ticketsData = numericSeatIds.map((seatId) => {
      const seat = seats.find((item) => item.id === seatId)
      const unitPrice = calcPricePerSeat(seat?.type ?? 'Standard')
      return {
        orderId: order.id,
        showtimeId: showtime.id,
        seatId,
        status: 'reserved' as const,
        unitPrice,
        reservedAt: now,
      }
    })

    await prisma.ticket.createMany({ data: ticketsData })
    await prisma.showtimeTakenSeat.createMany({
      data: numericSeatIds.map((seatId) => ({
        showtimeId: showtime.id,
        seatId,
      })),
      skipDuplicates: true,
    })

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
        seats: seats.map((seat) => ({ id: seat.id, row: seat.row, column: seat.column, type: seat.type })),
        orderId: order.id.toString(),
      })
      .catch((err) => console.warn('[mailer] send failed', err))

    const total = ticketsData.reduce((sum, ticket) => sum + Number(ticket.unitPrice), 0)

    return {
      orderId: order.id.toString(),
      reservedSeats: numericSeatIds,
      email,
      expiresAt: holdUntil.toISOString(),
      total,
      notice: 'Broneering loodud. Hoidke kinnitamiseks 15 minuti jooksul.',
    }
  }

  async cancelReservation(orderId: string | number) {
    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
      include: { tickets: true },
    })
    if (!order) throw new NotFoundError('Order not found')
    if (order.status === 'paid') throw new BadRequestError('Order already paid')

    const ticketIds = order.tickets.map((ticket) => Number(ticket.id))
    if (ticketIds.length) {
      await prisma.showtimeTakenSeat.deleteMany({
        where: {
          seatId: { in: order.tickets.map((ticket) => ticket.seatId) },
          showtimeId: { in: order.tickets.map((ticket) => ticket.showtimeId) },
        },
      })
      await prisma.ticket.deleteMany({ where: { id: { in: ticketIds } } })
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'expired', expiresAt: new Date() },
    })

    return { canceled: true as const }
  }

  async payOrder(authEmail: string, orderId: string | number) {
    const user = await prisma.user.findUnique({ where: { email: authEmail } })
    if (!user) throw new NotFoundError('User not found')

    const order = await prisma.order.findFirst({
      where: { id: BigInt(orderId), userId: user.id, status: 'pending' },
      include: {
        tickets: {
          include: {
            showtime: {
              include: {
                film: true,
                hall: { include: { theatre: true } },
              },
            },
            seat: true,
          },
        },
      },
    })
    if (!order) throw new NotFoundError('Order not found or not pending')

    const now = new Date()

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', expiresAt: null },
    })

    await prisma.ticket.updateMany({
      where: { orderId: order.id },
      data: { status: 'paid', paidAt: now },
    })

    const first = order.tickets[0]
    if (first) {
      const showtime = first.showtime
      mailer
        .sendReservationEmail({
          to: authEmail,
          filmTitle: showtime.film.title,
          theatreName: showtime.hall.theatre.name,
          hallName: showtime.hall.name,
          datetime: new Date(showtime.startsAt).toLocaleString('et-EE', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          seats: order.tickets.map((ticket) => ({
            id: ticket.seatId,
            row: ticket.seat.row,
            column: ticket.seat.column,
            type: ticket.seat.type,
          })),
          orderId: order.id.toString(),
        })
        .catch((err) => console.warn('[mailer] payOrder send failed', err))
    }

    return { ok: true as const }
  }

  private async releaseExpiredReservations(showtimeId: number, now: Date): Promise<void> {
    const expiredTickets = await prisma.ticket.findMany({
      where: {
        showtimeId,
        order: { status: 'pending', expiresAt: { lt: now } },
      },
      select: { id: true, orderId: true, seatId: true, showtimeId: true },
    })

    if (!expiredTickets.length) return

    const expiredIds = expiredTickets.map((ticket) => Number(ticket.id))
    await prisma.ticket.deleteMany({ where: { id: { in: expiredIds } } })
    await prisma.showtimeTakenSeat.deleteMany({
      where: {
        OR: expiredTickets.map((ticket) => ({ seatId: ticket.seatId, showtimeId: ticket.showtimeId })),
      },
    })

    const expiredOrderIds = Array.from(new Set(expiredTickets.map((ticket) => ticket.orderId).filter(Boolean)))
    if (expiredOrderIds.length) {
      await prisma.order.updateMany({
        where: { id: { in: expiredOrderIds }, status: 'pending' },
        data: { status: 'expired' },
      })
    }
  }
}

const checkoutService = new CheckoutService()
export default checkoutService
