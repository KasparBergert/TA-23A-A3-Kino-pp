import { prevent_admin_buy_tickets } from './triggers/prevent_admin_buy_tickets'
import { assignRandomGenresToFilms } from './utils/assignRandomGenresToFilms'
import showtimeRepositroy from '../../src/repositories/ShowtimeRepository'
import theatreRepository from '../../src/repositories/TheatreRepository'
import actorRepository from '../../src/repositories/ActorRepository'
import orderRepository from '../../src/repositories/OrderRepository'
import genreRepository from '../../src/repositories/GenreRepositroy'
import userRepository from '../../src/repositories/UserRepository'
import filmRepository from '../../src/repositories/FilmRepository'
import hallRepositroy from '../../src/repositories/HallRepository'
import { showtimeSeed } from './data/ShowtimesData'
import { genresSeed } from './data/genresData'
import { actorsSeed } from './data/ActorsData'
import { theatreSeed } from './data/TheatresData'
import { ordersSeed } from './data/OrdersData'
import { usersSeed } from './data/UsersData'
import { filmsSeed } from './data/FilmsData'
import { hallsSeed } from './data/HallsData'
import prisma from '../../db'

async function runSeed() {
  // -- DATA --
  await filmRepository.createMany(filmsSeed)
  await genreRepository.createMany(genresSeed)
  await assignRandomGenresToFilms()

  await actorRepository.createMany(actorsSeed)

  await theatreRepository.createMany(theatreSeed)
  await hallRepositroy.createMany(hallsSeed)
  await showtimeRepositroy.createMany(showtimeSeed)

  await userRepository.createMany(usersSeed)
  await orderRepository.createMany(ordersSeed)

  // -- TRIGGERS --
  await prevent_admin_buy_tickets()
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
