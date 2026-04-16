import prisma from '../../../db'
import { BadRequestError, ConflictError } from '../../errors/HttpError'
import { calcPricePerSeat } from '../../utils/pricing'
import userService from '../UserService'
import showtimeService from '../ShowtimeService'
import checkoutOrderService from './CheckoutOrderService'
import checkoutNotificationService from './CheckoutNotificationService'


class CheckoutService {
  constructor(
    private readonly users = userService,
    private readonly showtimes = showtimeService,
    private readonly orders = checkoutOrderService,
    private readonly notifications = checkoutNotificationService,
  ) { }

  async createReservation(params: { showtimeId: number; seatIds: number[]; email?: string }) {
    const input = this.validateReservationInput(params)
    const showtime = await this.showtimes.getById(input.showtimeId)

    const now = new Date()
    await this.orders.releaseExpiredReservations(showtime.id, now)

    const seats = await this.getValidSeatsForShowtime(showtime, input.seatIds)
    await this.ensureSeatsAreAvailable(showtime.id, input.seatIds, now)

    const holdUntil = this.createHoldExpiry(now)
    const user = await this.findOrCreateGuestUser(input.email)
    const order = await this.createPendingOrder(user.id, holdUntil)

    const ticketsData = this.buildReservedTickets(order.id, showtime.id, seats, now)
    await this.persistReservation(showtime.id, input.seatIds, ticketsData)

    this.notifications.sendReservationConfirmation(input.email, showtime, seats, order.id)
    return this.buildReservationResponse(order.id, input.seatIds, input.email, holdUntil, ticketsData)
  }

  async cancelReservation(orderId: string | number) {
    const order = await this.orders.getCancelableOrderOrThrow(orderId)
    await this.orders.removeReservedSeats(order)
    await this.orders.markOrderExpired(order.id)
    return { canceled: true as const }
  }

  async payOrder(authEmail: string, orderId: string | number) {
    const user = await this.users.getByEmail(authEmail)
    const order = await this.orders.getPendingOrderForUserOrThrow(user.id, orderId)
    const now = new Date()

    await this.orders.markOrderPaid(order.id)
    await this.orders.markTicketsPaid(order.id, now)
    this.notifications.sendPaidOrderConfirmation(authEmail, order)

    return { ok: true as const }
  }

  private validateReservationInput(params: {
    showtimeId: number
    seatIds: number[]
    email?: string
  }) {
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

    return {
      showtimeId: Number(showtimeId),
      seatIds: seatIds.map(Number),
      email,
    }
  }

  private async getValidSeatsForShowtime(
    showtime: { hallId: number },
    seatIds: number[],
  ) {
    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds }, hallId: showtime.hallId },
    })

    if (seats.length !== seatIds.length) {
      throw new BadRequestError('Some seats do not belong to this hall')
    }

    return seats
  }

  private async ensureSeatsAreAvailable(showtimeId: number, seatIds: number[], now: Date): Promise<void> {
    const existing = await prisma.ticket.findMany({
      where: {
        showtimeId,
        seatId: { in: seatIds },
        OR: [
          { order: { status: 'paid' } },
          { order: { status: 'pending', OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] } },
        ],
      },
    })

    if (existing.length) {
      throw new ConflictError('Some seats already booked')
    }
  }

  private createHoldExpiry(now: Date): Date {
    return new Date(now.getTime() + 15 * 60 * 1000)
  }

  private async findOrCreateGuestUser(email: string) {
    return await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, password: 'temporary', role: 'user' },
    })
  }

  private async createPendingOrder(userId: number, holdUntil: Date) {
    return await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        expiresAt: holdUntil,
      },
    })
  }

  private buildReservedTickets(
    orderId: bigint,
    showtimeId: number,
    seats: Array<{ id: number; type: string | null }>,
    reservedAt: Date,
  ) {
    return seats.map((seat) => ({
      orderId,
      showtimeId,
      seatId: seat.id,
      status: 'reserved' as const,
      unitPrice: calcPricePerSeat(seat.type ?? 'Standard'),
      reservedAt,
    }))
  }

  private async persistReservation(
    showtimeId: number,
    seatIds: number[],
    ticketsData: Array<{
      orderId: bigint
      showtimeId: number
      seatId: number
      status: 'reserved'
      unitPrice: number
      reservedAt: Date
    }>,
  ): Promise<void> {
    await prisma.ticket.createMany({ data: ticketsData })
    await prisma.showtimeTakenSeat.createMany({
      data: seatIds.map((seatId) => ({
        showtimeId,
        seatId,
      })),
      skipDuplicates: true,
    })
  }

  private buildReservationResponse(
    orderId: bigint,
    seatIds: number[],
    email: string,
    holdUntil: Date,
    ticketsData: Array<{ unitPrice: number }>,
  ) {
    const total = ticketsData.reduce((sum, ticket) => sum + Number(ticket.unitPrice), 0)

    return {
      orderId: orderId.toString(),
      reservedSeats: seatIds,
      email,
      expiresAt: holdUntil.toISOString(),
      total,
      notice: 'Broneering loodud. Hoidke kinnitamiseks 15 minuti jooksul.',
    }
  }
}

const checkoutService = new CheckoutService()
export default checkoutService
