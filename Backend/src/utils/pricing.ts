export function calcPricePerSeat(type: string): number {
  switch (type) {
    case 'Premium':
      return 14
    case 'Double':
      return 18
    default:
      return 12
  }
}
