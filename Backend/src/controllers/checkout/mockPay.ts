import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function mockPay(req: Request, res: Response) {
  try {
    const { showtimeId, seatIds, pricePerSeat, email } = req.body as {
      showtimeId: number
      seatIds: number[]
      pricePerSeat?: number
      email?: string
    }

    console.log('mockPay body', req.body)

    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).send('showtimeId and seatIds are required')
    }
    if (!email || !/.+@.+\..+/.test(email)) {
      return res.status(400).send('valid email required')
    }

    const showtime = await prisma.showtime.findUnique({ where: { id: Number(showtimeId) } })
    if (!showtime) return res.status(404).send('Showtime not found')

    const seats = await prisma.seat.findMany({ where: { id: { in: seatIds.map(Number) }, hallId: showtime.hallId } })
    if (seats.length !== seatIds.length) return res.status(400).send('Some seats do not belong to this hall')

    const existing = await prisma.ticket.findMany({ where: { showtimeId: showtime.id, seatId: { in: seatIds.map(Number) } } })
    if (existing.length) return res.status(409).send('Some seats already booked')

    const unitPrice = pricePerSeat ?? 10
    const now = new Date()

    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'guest@local', password: 'mock', role: 'user' },
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'paid',
        expiresAt: null,
      },
    })

    await prisma.ticket.createMany({
      data: seatIds.map((seatId) => ({
        orderId: order.id,
        showtimeId: showtime.id,
        seatId: Number(seatId),
        status: 'paid',
        unitPrice,
        reservedAt: now,
        paidAt: now,
      })),
    })

    return res.status(201).json({
      orderId: order.id.toString(),
      paidSeats: seatIds,
      email,
      notice: 'Mock checkout: piletid märgiti makstuks ja e-kiri oleks saadetud (mock).',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Checkout failed')
  }
}
