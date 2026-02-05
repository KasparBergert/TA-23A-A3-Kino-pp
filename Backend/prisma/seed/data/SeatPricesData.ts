import { seatType } from "@prisma/client"

function seatPrices(){
  const typeList: seatType[] = [seatType.Double, seatType.Premium, seatType.Standard]
  return typeList.map((type) => {
    return {
      type: type,
      price: Math.floor(Math.random() * 19)
    }
  })
}

const seatPricesSeed = seatPrices();
export default seatPricesSeed
