interface Seat {
  row: string,
  col: number,
  is_available?: boolean,
  is_selected?: boolean,
}

export default Seat
