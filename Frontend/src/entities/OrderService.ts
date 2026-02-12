import client from '../utils/api'
import type OrderSummary from '../../../shared/types/OrderSummary'

async function getMine(): Promise<OrderSummary[]> {
  return client.get('/orders/me')
}

async function pay(orderId: string): Promise<{ ok: boolean }> {
  return client.post('/checkout/pay', { orderId })
}

export const orderService = {
  getMine,
  pay,
}
