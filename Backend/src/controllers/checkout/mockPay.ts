import { Request, Response } from 'express'
import prisma from '../../../db'
import mailer from '../../lib/mailer'
import { calcPricePerSeat } from '../../utils/pricing'

export default async function mockPay(req: Request, res: Response) {
  try {
    const { showtimeId, seatIds, email: rawEmail } = req.body as {
      showtimeId: number
      seatIds: number[]
      email?: string
    }

    console.log('mockPay body', req.body)

    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).send('showtimeId and seatIds are required')
    }
    if (seatIds.length > 10) {
      return res.status(400).send('Maksimaalselt 10 kohta korraga')
    }
    const email = (rawEmail ?? '').trim()
    // allow any non-empty value; front-end already prompts for e-post
    if (!email || email.length < 3) {
      return res.status(400).send('valid email required')
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: Number(showtimeId) },
      include: { film: true, hall: { include: { theatre: true } } },
    })
    if (!showtime) return res.status(404).send('Showtime not found')

    // clear expired holds for this showtime
    const now = new Date()
    const expiredTickets = await prisma.ticket.findMany({
      where: {
        showtimeId: showtime.id,
        order: { status: 'pending', expiresAt: { lt: now } },
      },
      select: { id: true, orderId: true, seatId: true, showtimeId: true },
    })
    if (expiredTickets.length) {
      const expiredIds = expiredTickets.map((t) => Number(t.id))
      await prisma.ticket.deleteMany({ where: { id: { in: expiredIds } } })
      await prisma.showtimeTakenSeat.deleteMany({
        where: {
          OR: expiredTickets.map((t) => ({ seatId: t.seatId, showtimeId: t.showtimeId })),
        },
      })
      const expiredOrderIds = Array.from(new Set(expiredTickets.map((t) => t.orderId).filter(Boolean)))
      if (expiredOrderIds.length) {
        await prisma.order.updateMany({
          where: { id: { in: expiredOrderIds }, status: 'pending' },
          data: { status: 'expired' },
        })
      }
    }

    const seats = await prisma.seat.findMany({ where: { id: { in: seatIds.map(Number) }, hallId: showtime.hallId } })
    if (seats.length !== seatIds.length) return res.status(400).send('Some seats do not belong to this hall')

    const existing = await prisma.ticket.findMany({
      where: {
        showtimeId: showtime.id,
        seatId: { in: seatIds.map(Number) },
        OR: [
          { order: { status: 'paid' } },
          { order: { status: 'pending', OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] } },
        ],
      },
    })
    if (existing.length) return res.status(409).send('Some seats already booked')

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

    const ticketsData = seatIds.map((seatId) => {
      const seat = seats.find((s) => s.id === Number(seatId))
      const unitPrice = calcPricePerSeat(seat?.type ?? 'Standard')
      return {
        orderId: order.id,
        showtimeId: showtime.id,
        seatId: Number(seatId),
        status: 'reserved',
        unitPrice,
        reservedAt: now,
      }
    })

    await prisma.ticket.createMany({
      data: seatIds.map((seatId) => ({
        orderId: order.id,
        showtimeId: showtime.id,
        seatId: Number(seatId),
        status: 'reserved',
        unitPrice: calcPricePerSeat(seats.find((s) => s.id === Number(seatId))?.type ?? 'Standard'),
        reservedAt: now,
      })),
    })
    await prisma.showtimeTakenSeat.createMany({
      data: seatIds.map((seatId) => ({
        showtimeId: showtime.id,
        seatId: Number(seatId),
      })),
      skipDuplicates: true,
    })

    // Try to send confirmation email (non-blocking failure)
    mailer
      .sendReservationEmail({
        to: email,
        filmTitle: showtime.film.title,
        theatreName: showtime.hall.theatre.name,
        hallName: showtime.hall.name,
        datetime: new Date(showtime.startsAt).toLocaleString('et-EE', { dateStyle: 'medium', timeStyle: 'short' }),
        seats: seats.map((s) => ({ id: s.id, row: s.row, type: s.type })),
        orderId: order.id.toString(),
      })
      .catch((err) => console.warn('[mailer] send failed', err))

    const total = ticketsData.reduce((sum, t) => sum + Number(t.unitPrice), 0)

    return res.status(201).json({
      orderId: order.id.toString(),
      reservedSeats: seatIds,
      email,
      expiresAt: holdUntil.toISOString(),
      total,
      notice: 'Broneering loodud. Hoidke kinnitamiseks 15 minuti jooksul.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Checkout failed')
  }
}
