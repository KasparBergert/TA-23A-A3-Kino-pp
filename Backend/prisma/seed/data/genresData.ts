import { genre } from "@prisma/client"

export const genreSeed: Omit<genre, 'id'>[] = [
  { name: 'Action' },
  { name: 'Drama' },
  { name: 'Comedy' },
  { name: 'Sci-Fi' },
]
