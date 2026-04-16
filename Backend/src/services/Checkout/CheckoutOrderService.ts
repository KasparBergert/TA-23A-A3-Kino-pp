import prisma from '../../../db'
import { BadRequestError, NotFoundError } from '../../errors/HttpError'

class CheckoutOrderService {
  async getPendingOrderForUserOrThrow(userId: number, orderId: string | number) {
    const order = await prisma.order.findFirst({
      where: { id: BigInt(orderId), userId, status: 'pending' },
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
    return order
  }

  async markOrderPaid(orderId: bigint): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid', expiresAt: null },
    })
  }

  async markTicketsPaid(orderId: bigint, paidAt: Date): Promise<void> {
    await prisma.ticket.updateMany({
      where: { orderId },
      data: { status: 'paid', paidAt },
    })
  }

  async getCancelableOrderOrThrow(orderId: string | number) {
    const order = await prisma.order.findUnique({
      where: { id: BigInt(orderId) },
      include: { tickets: true },
    })

    if (!order) throw new NotFoundError('Order not found')
    if (order.status === 'paid') throw new BadRequestError('Order already paid')

    return order
  }

  async removeReservedSeats(order: {
    tickets: { id: bigint; seatId: number; showtimeId: number }[]
  }): Promise<void> {
    const ticketIds = order.tickets.map((ticket) => Number(ticket.id))
    if (!ticketIds.length) return

    await prisma.showtimeTakenSeat.deleteMany({
      where: {
        seatId: { in: order.tickets.map((ticket) => ticket.seatId) },
        showtimeId: { in: order.tickets.map((ticket) => ticket.showtimeId) },
      },
    })

    await prisma.ticket.deleteMany({
      where: { id: { in: ticketIds } },
    })
  }

  async markOrderExpired(orderId: bigint): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'expired', expiresAt: new Date() },
    })
  }

  async releaseExpiredReservations(showtimeId: number, now: Date): Promise<void> {
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

    const expiredOrderIds = Array.from(
      new Set(expiredTickets.flatMap((ticket) => (ticket.orderId === null ? [] : [ticket.orderId]))),
    )

    if (expiredOrderIds.length) {
      await prisma.order.updateMany({
        where: { id: { in: expiredOrderIds }, status: 'pending' },
        data: { status: 'expired' },
      })
    }
  }
}

const checkoutOrderService = new CheckoutOrderService()
export default checkoutOrderService
