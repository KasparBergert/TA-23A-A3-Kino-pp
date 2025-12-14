import { order } from '@prisma/client'
import prisma from '../../db'

class OrderRepository {
  async getAll() {
    return await prisma.order.findMany({})
  }

  async createMany(order: Omit<order, 'id' | 'createdAt'>[]) {
    await prisma.order.createMany({
      data: order,
    })
  }
}

const orderRepository = new OrderRepository()
export default orderRepository
