import prisma from '../../Backend/db'

import { createRoles } from './create/roles'
import { createUsers } from './create/users'
import { createFilms } from './create/films'
import { createGenres } from './create/genres'
import { createTheatres } from './create/theatres'
import { createHalls } from './create/halls'
import { createSeats } from './create/seats'
import { createShowtimes } from './create/showtimes'
import { createOrdersForUser } from './create/orders'
import { preventAdminBuyTickets } from './triggers/preventAdminBuyTickets'

import {
  getFilmByTitle,
  getGenreByName,
  getTheatreByName,
  getUserByEmail
} from './utils/fetch'

async function runSeed() {
  await createRoles()
  await createUsers()

  await createFilms()
  await createGenres()

  const [darkKnight, inception, interstellar] = await Promise.all([
    getFilmByTitle('The Dark Knight'),
    getFilmByTitle('Inception'),
    getFilmByTitle('Interstellar'),
  ])

  const [action, drama, comedy, scifi] = await Promise.all([
    getGenreByName('Action'),
    getGenreByName('Drama'),
    getGenreByName('Comedy'),
    getGenreByName('Sci-Fi')
  ])

  await prisma.film_genres.createMany({
    data: [
      { film_id: darkKnight.id, genre_id: action.id },
      { film_id: darkKnight.id, genre_id: scifi.id },
      { film_id: inception.id, genre_id: drama.id },
      { film_id: interstellar.id, genre_id: comedy.id },
    ],
    skipDuplicates: true,
  })

  await createTheatres()

  const theatres = await Promise.all([
    getTheatreByName('Downtown Cinema'),
    getTheatreByName('Suburbia Screens')
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

  await preventAdminBuyTickets()
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
