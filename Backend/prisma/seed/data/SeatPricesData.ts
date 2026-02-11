import { PrismaClient, seatType } from '@prisma/client'

function seatPrices() {
  return [
    {
      type: seatType.Double,
      price: 14,
    },
    {
      type: seatType.Premium,
      price: 16,
    },
    {
      type: seatType.Standard,
      price: 9,
    },
  ]
}

const seatPricesSeed = seatPrices()
export default seatPricesSeed
