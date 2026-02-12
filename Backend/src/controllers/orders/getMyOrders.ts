import { Request, Response } from 'express'
import prisma from '../../../db'

export default async function getMyOrders(req: Request, res: Response) {
  try {
    const auth = (req as any).auth as { email?: string }
    if (!auth?.email) return res.status(401).send('Unauthorized')

    const user = await prisma.user.findUnique({ where: { email: auth.email } })
    if (!user) return res.status(404).send('User not found')

    const orders = await prisma.order.findMany({
      where: { userId: user.id, status: { in: ['pending', 'paid'] } },
      orderBy: { createdAt: 'desc' },
      include: {
        tickets: {
          include: {
            showtime: {
              include: {
                film: true,
                hall: { include: { theatre: true } },
              },
            },
          },
        },
      },
    })

    const formatted = orders.map((order) => {
      const first = order.tickets[0]
      const showtime = first?.showtime
      const total = order.tickets.reduce((sum, t) => sum + Number(t.unitPrice), 0)
      return {
        id: order.id.toString(),
        status: order.status,
        createdAt: order.createdAt,
        showtimeId: showtime?.id,
        film: showtime ? { id: showtime.film.id, title: showtime.film.title } : null,
        theatre: showtime ? { id: showtime.hall.theatre.id, name: showtime.hall.theatre.name } : null,
        hall: showtime ? { id: showtime.hall.id, name: showtime.hall.name } : null,
        startsAt: showtime?.startsAt,
        seats: order.tickets.map((t) => t.seatId),
        total,
      }
    })

    return res.json(formatted)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Failed to load orders')
  }
}
