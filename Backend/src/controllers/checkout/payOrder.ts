import { Request, Response } from 'express'
import prisma from '../../../db'
import mailer from '../../lib/mailer'

export default async function payOrder(req: Request, res: Response) {
  try {
    const auth = (req as any).auth as { email?: string }
    if (!auth?.email) return res.status(401).send('Unauthorized')

    const { orderId } = req.body as { orderId?: string | number }
    if (!orderId) return res.status(400).send('orderId required')

    const user = await prisma.user.findUnique({ where: { email: auth.email } })
    if (!user) return res.status(404).send('User not found')

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

    if (!order) return res.status(404).send('Order not found or not pending')

    const now = new Date()

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', expiresAt: null },
    })

    await prisma.ticket.updateMany({
      where: { orderId: order.id },
      data: { status: 'paid', paidAt: now },
    })

    // send confirmation email (best effort)
    const first = order.tickets[0]
    if (first) {
      const st = first.showtime
      mailer
        .sendReservationEmail({
          to: auth.email,
          filmTitle: st.film.title,
          theatreName: st.hall.theatre.name,
          hallName: st.hall.name,
          datetime: new Date(st.startsAt).toLocaleString('et-EE', { dateStyle: 'medium', timeStyle: 'short' }),
          seats: order.tickets.map((t) => ({ id: t.seatId, row: t.seat.row, type: t.seat.type })),
          orderId: order.id.toString(),
        })
        .catch((err) => console.warn('[mailer] payOrder send failed', err))
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).send('Payment confirmation failed')
  }
}
