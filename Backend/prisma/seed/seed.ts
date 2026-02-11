import { assignRandomGenresToFilms } from './utils/assignRandomGenresToFilms'
import showtimeRepositroy from '../../src/repositories/ShowtimeRepository'
import theatreRepository from '../../src/repositories/TheatreRepository'
import actorRepository from '../../src/repositories/ActorRepository'
import orderRepository from '../../src/repositories/OrderRepository'
import genreRepository from '../../src/repositories/GenreRepositroy'
import userRepository from '../../src/repositories/UserRepository'
import filmRepository from '../../src/repositories/FilmRepository'
import hallRepositroy from '../../src/repositories/HallRepository'
import { createShowtimeSeed } from './data/ShowtimesData'
import { createOrdersSeed } from './data/OrdersData'
import createSeatMatrix from './data/SeatsData'
import { createHallSeed } from './data/HallsData'
import { theatreSeed } from './data/TheatresData'
import { genreSeed } from './data/genresData'
import { createFilmSeed } from './data/FilmsData'
import { usersSeed } from './data/UsersData'
import passwordUtils from '../../utils/passwordUtils'
import seatPricesSeed from './data/SeatPricesData'
import prisma from '../../db'
import { createActorsSeed } from './data/ActorsData'
import seatRepository from '../../src/repositories/SeatRepository'
import { createReviewsSeed } from './data/ReviewsData'
import reviewRepository from '../../src/repositories/ReviewRepository'
import { Prisma } from '@prisma/client'

async function runSeed() {
  // clean tables to avoid duplicates between runs
  await prisma.$transaction([
    prisma.showtimeTakenSeat.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.order.deleteMany(),
    prisma.showtime.deleteMany(),
    prisma.filmGenre.deleteMany(),
    prisma.review.deleteMany(),
    prisma.actor.deleteMany(),
    prisma.seat.deleteMany(),
    prisma.seatPrices.deleteMany(),
    prisma.film.deleteMany(),
    prisma.hall.deleteMany(),
    prisma.theatre.deleteMany(),
    prisma.genre.deleteMany(),
    prisma.user.deleteMany(),
  ] as const)

  await theatreRepository.createMany(theatreSeed)
  const hallsSeed = await createHallSeed()
  await hallRepositroy.createMany(hallsSeed)
  await genreRepository.createMany(genreSeed)
  const halls = await hallRepositroy.getAll()
  const seats = createSeatMatrix(halls.map(h => h.id))
  await seatRepository.createMany(seats)
  await seatRepository.createManySeatPrices(seatPricesSeed)

  const filmsSeed = await createFilmSeed()
  await filmRepository.createMany(filmsSeed)
  await genreRepository.createMany(genreSeed)
  await assignRandomGenresToFilms()
  const actorsSeed = await createActorsSeed()
  await actorRepository.createMany(actorsSeed)

  const reviewsSeed = await createReviewsSeed()
  if (reviewsSeed.length) {
    await reviewRepository.createMany(reviewsSeed)
  }

  const showtimeSeed = await createShowtimeSeed()
  await showtimeRepositroy.createMany(showtimeSeed)

  // Hash seeded user passwords so login works with seed accounts
  const hashedUsers = await Promise.all(
    usersSeed.map(async (u) => ({ ...u, password: await passwordUtils.createhash(u.password) })),
  )
  await userRepository.createMany(hashedUsers)
  const ordersSeed = await createOrdersSeed()
  await orderRepository.createMany(ordersSeed)

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
