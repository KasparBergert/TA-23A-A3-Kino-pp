import { seats_type } from "@prisma/client"
import { seats_status } from "@prisma/client"

type SeatDTO = {
  type: seats_type,
  id: number,
  status: seats_status,
  price: number,
  row_label: string,
  column: number
}
export default SeatDTO
