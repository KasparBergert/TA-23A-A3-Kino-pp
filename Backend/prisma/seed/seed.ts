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
import genereateHallSeating from './data/SeatsData'
import { createHallsSeed } from './data/HallsData'
import { theatreSeed } from './data/TheatresData'
import { genresSeed } from './data/genresData'
import { filmsSeed } from './data/FilmsData'
import { usersSeed } from './data/UsersData'
import prisma from '../../db'
import { createActorsSeed } from './data/ActorsData'

async function runSeed() {
  // -- DATA --

  await theatreRepository.createMany(theatreSeed)
  const hallsSeed = await createHallsSeed()
  await hallRepositroy.createMany(hallsSeed)
  await genereateHallSeating(await hallRepositroy.getAll())

  await filmRepository.createMany(filmsSeed)
  await genreRepository.createMany(genresSeed)
  await assignRandomGenresToFilms()
  const actorsSeed = await createActorsSeed()
  await actorRepository.createMany(actorsSeed)

  const showtimeSeed = await createShowtimeSeed()
  await showtimeRepositroy.createMany(showtimeSeed)

  await userRepository.createMany(usersSeed)
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
