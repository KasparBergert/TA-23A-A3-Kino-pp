import { genres } from "@prisma/client"

export const genresSeed: Omit<genres, 'id'>[] = [
  { name: 'Action' },
  { name: 'Drama' },
  { name: 'Comedy' },
  { name: 'Sci-Fi' },
]
