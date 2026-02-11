import { genre } from "@prisma/client"

export const genreSeed: Omit<genre, 'id'>[] = [
  { name: 'Märul' },
  { name: 'Draama' },
  { name: 'Komöödia' },
  { name: 'Ulme' },
  { name: 'Seiklus' },
  { name: 'Põnevik' },
]
