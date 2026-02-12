import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function cancelReservation(req: Request, res: Response) {
  try {
    const { orderId } = req.body as { orderId?: string | number }
    if (!orderId) return res.status(400).send('orderId required')

    const order = await prisma.order.findUnique({ where: { id: BigInt(orderId) }, include: { tickets: true } })
    if (!order) return res.status(404).send('Order not found')
    if (order.status === 'paid') return res.status(400).send('Order already paid')

    // delete tickets and taken seats
    const ticketIds = order.tickets.map((t) => Number(t.id))
    if (ticketIds.length) {
      await prisma.showtimeTakenSeat.deleteMany({ where: { seatId: { in: order.tickets.map((t) => t.seatId) }, showtimeId: { in: order.tickets.map((t) => t.showtimeId) } } })
      await prisma.ticket.deleteMany({ where: { id: { in: ticketIds } } })
    }

    await prisma.order.update({ where: { id: order.id }, data: { status: 'expired', expiresAt: new Date() } })

    return res.status(200).json({ canceled: true })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Cancel failed')
  }
}
