import { seats } from "@prisma/client"

type SeatDTO = Omit<seats, 'id'>
export default SeatDTO
