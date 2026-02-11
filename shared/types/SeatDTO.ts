import type { seat } from "@prisma/client"

type SeatDTO = seat & { isTaken: boolean };

export default SeatDTO
