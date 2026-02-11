import { z } from 'zod'

const stringUrl = z.string().url()
const optionalDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().date())
  .transform((value) => new Date(value))

export const filmCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  posterUrl: stringUrl,
  description: z.string().optional(),
  releaseDate: optionalDate.optional(),
  durationMin: z.number().int().positive().optional(),
  theatreId: z.number().int().positive().optional().nullable(),
})

export const filmUpdateSchema = filmCreateSchema.partial()

export const theatreCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin', 'super_admin']),
})

export const userRoleUpdateSchema = z.object({
  role: z.enum(['user', 'admin', 'super_admin']),
})

export const showtimeQuerySchema = z.object({
  filmId: z.coerce.number().int().positive().optional(),
  theatreId: z.coerce.number().int().positive().optional(),
  hallId: z.coerce.number().int().positive().optional(),
  showtimeId: z.coerce.number().int().positive().optional(),
  genreId: z.coerce.number().int().positive().optional(),
  date: z.string().date().optional(),
})

export type FilmCreateInput = z.infer<typeof filmCreateSchema>
export type FilmUpdateInput = z.infer<typeof filmUpdateSchema>
export type TheatreCreateInput = z.infer<typeof theatreCreateSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type ShowtimeQuery = z.infer<typeof showtimeQuerySchema>
