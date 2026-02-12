import SeatDTO from "../../../shared/types/SeatDTO";

let cache: SeatDTO[] = []

function get(){
  return cache
}

function add(seats: SeatDTO[]){
  for(const seat of seats){
    cache.push(seat);
  }
}

function clear(){
  cache = []
}

export default {
  get, add, clear
}
