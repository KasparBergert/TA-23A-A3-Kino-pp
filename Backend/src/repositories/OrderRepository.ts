import { orders } from '@prisma/client'
import prisma from '../../db'

class OrderRepository {
  async getAll() {
    return await prisma.orders.findMany({})
  }

  async createMany(orders: Omit<orders, 'id' | 'created_at'>[]) {
    await prisma.orders.createMany({
      data: orders,
    })
  }
}

const orderRepository = new OrderRepository()
export default orderRepository
