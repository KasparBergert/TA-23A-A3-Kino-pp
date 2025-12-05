import prisma from '../../Backend/db'
import { createRoles } from './create/roles'
import { createUsers } from './create/users'
import { createFilms } from './create/films'
import { createActors } from './create/actors'
import { createGenres } from './create/genres'
import { createTheatres } from './create/theatres'
import { createHalls } from './create/halls'
import { createSeats } from './create/seats'
import { createShowtimes } from './create/showtimes'
import { createOrdersForUser } from './create/orders'
import { prevent_admin_buy_tickets } from './triggers/prevent_admin_buy_tickets'
import { seat_deletion_validator } from './triggers/seat_deletion_validator'
import { prevent_double_seat_when_seat_next_is_taken } from './triggers/prevent_double_seat_when_seat_next_is_taken'
import { assignRandomGenresToFilms } from './utils/assignRandomGenresToFilms'
import { getTheatreByName, getUserByEmail } from './utils/fetch'

async function runSeed() {
  // -- DATA --
  await createRoles()
  await createUsers()

  await createFilms()
  await createGenres()
  await assignRandomGenresToFilms()

  await createActors()

  await createTheatres()

  const theatres = await Promise.all([
    getTheatreByName('Downtown Cinema'),
    getTheatreByName('Suburbia Screens'),
  ])

  await createHalls(theatres)
  await createSeats()
  await createShowtimes()

  const [alice, bob] = await Promise.all([
    getUserByEmail('alice@example.com'),
    getUserByEmail('bob@example.com'),
  ])

  await createOrdersForUser(alice)
  await createOrdersForUser(bob)

  // -- TRIGGERS --
  await prevent_admin_buy_tickets()
  await seat_deletion_validator()
  await prevent_double_seat_when_seat_next_is_taken()
}

;(async () => {
  try {
    await runSeed()
    console.log('Seed completed successfully!')
  } catch (err) {
    console.error('Error during seeding:', err)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
})()
