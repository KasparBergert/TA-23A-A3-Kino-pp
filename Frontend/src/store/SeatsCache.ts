import SeatDTO from "../../../shared/types/SeatDTO";

const cache: SeatDTO[] = []

function get(){
  return cache
}

function add(seats: SeatDTO[]){
  for(const seat of seats){
    cache.push(seat);
  }
}

export default {
  get, add
}
