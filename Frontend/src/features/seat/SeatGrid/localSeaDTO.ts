import SeatDTO from "../../../../../shared/types/SeatDTO"

interface localSeatDTO extends Omit<SeatDTO, 'isTaken'> {
  status: 'available' | 'taken' | 'selected';
}
export default localSeatDTO
