import prisma from '../Backend/db.ts'
import { Prisma } from '@prisma/client'

// ===================================================== GET FUNCTIONS =====================================================

const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) {
    throw Error(`${email} not found after seed`)
  }
  return user
}

const getRoleByCode = async (code: string) => {
  const role = await prisma.roles.findUnique({ where: { code } })
  if (!role) {
    throw Error(`${code} not found after seed`)
  }
  return role
}

const getFilmByTitle = async (title: string) => {
  const film = await prisma.films.findFirst({ where: { title } })
  if (!film) {
    throw Error(`${title} not found after seed`)
  }
  return film
}

const getGenreByName = async (name: string) => {
  const genre = await prisma.genres.findFirst({ where: { name } })
  if (!genre) {
    throw Error(`${name} not found after seed`)
  }
  return genre
}

const getTheatreByName = async (name: string) => {
  const theatre = await prisma.theatres.findUnique({ where: { name } })
  if (!theatre) throw new Error(`Theatre "${name}" not found after seed`)
  return theatre
}

// ===================================================== SEED FUNCTION =====================================================

async function runSeed() {
  // ========== ROLES ==========
  await createRoles()
  await createUsers()

  // ========== USER_ROLES (linking) ==========

  await createFilms()
  await createGenres()

  const [firstMovie, anotherFilm, indieHit] = await Promise.all([
    getFilmByTitle('The Dark Knight'),
    getFilmByTitle('Inception'),
    getFilmByTitle('Interstellar'),
  ])

  const [action, drama, comedy, scifi] = await Promise.all([
    getGenreByName('Action'),
    getGenreByName('Drama'),
    getGenreByName('Comedy'),
    getGenreByName('Sci-Fi'),
  ])

  // ========== FILM_GENRES (linking) ==========
  await prisma.film_genres.createMany({
    data: [
      { film_id: firstMovie.id, genre_id: action.id }, // The First Movie → Action
      { film_id: firstMovie.id, genre_id: scifi.id }, // The First Movie → Sci-Fi
      { film_id: anotherFilm.id, genre_id: drama.id }, // Another Great Film → Drama
      { film_id: indieHit.id, genre_id: comedy.id }, // Indie Hit → Comedy
    ],
    skipDuplicates: true,
  })

  await createTheatres()

  const theatres: { id: number; name: string }[] = await Promise.all([
    getTheatreByName('Downtown Cinema'), // gets halls applied
    getTheatreByName('Suburbia Screens'), // doesn't get any halls.
    //look at createHalls function for details
  ])

  await createHalls(theatres)

  // ========== SEATS ==========
  await createSeats()

  // ========== SHOWTIMES ==========
  await createShowtimes()

  // ========== ORDERS ==========
  const [alice, bob] = await Promise.all([
    getUserByEmail('alice@example.com'),
    getUserByEmail('bob@example.com'),
  ])

  //also adding alice to test if admins can buy tickets.
  await createOrdersForUser(alice)
  await createOrdersForUser(bob)

  // ========== TICKETS ==========
  //await createTickets() skip for now future thing

  // ========== APPLYING TIGGERS ==========
  preventAdminBuyTickets()
}

// ===================================================== CREATE FUNCTIONS =====================================================

async function createRoles() {
  const roles = [{ code: 'admin' }, { code: 'user' }]

  await prisma.roles.createMany({
    data: roles,
    skipDuplicates: true,
  })
}

//created and adds the necessary roles to users
async function createUsers() {
  const [admin, user] = await Promise.all([getRoleByCode('admin'), getRoleByCode('user')])

  await prisma.users.createMany({
    data: [
      {
        email: 'alice@example.com',
        password:
          '$argon2id$v=19$m=65535,t=2,p=6$OS0pKEBtYjtvcGV3ZWY$aFG+Yn7dwfCVJkRZEZdm62GZ6DHl1WOHFSYcg7izQPzVQoOvgtHvReNDbkAcxqL6y4ZKas2HblGG+GG0tPqbRQ',
        role_id: admin.id,
      },
      {
        email: 'bob@example.com',
        password:
          '$argon2id$v=19$m=65535,t=2,p=6$OS0pKEBtYjtvcGV3ZWY$aFG+Yn7dwfCVJkRZEZdm62GZ6DHl1WOHFSYcg7izQPzVQoOvgtHvReNDbkAcxqL6y4ZKas2HblGG+GG0tPqbRQ',
        role_id: user.id,
      },
    ],
    skipDuplicates: true,
  })
}

// ========== FILMS ==========
async function createFilms() {
  const films = [
    {
      title: 'The Dark Knight',
      description: 'An epic beginning.',
      release_date: new Date('2020-01-01'),
      duration_min: 120,
      poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
      title: 'Inception',
      description: 'Sequel to the epic.',
      release_date: new Date('2021-06-15'),
      duration_min: 135,
      poster_url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    },
    {
      title: 'Interstellar',
      description: 'Low budget, high heart.',
      release_date: new Date('2019-11-02'),
      duration_min: 95,
      poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
  ]

  await prisma.films.createMany({
    data: films,
    skipDuplicates: true,
  })
}

// ========== GENRES ==========
async function createGenres() {
  const genres = [{ name: 'Action' }, { name: 'Drama' }, { name: 'Comedy' }, { name: 'Sci-Fi' }]

  await prisma.genres.createMany({
    data: genres,
    skipDuplicates: true,
  })
}

// ========== THEATRES ==========
async function createTheatres() {
  const theatres = [{ name: 'Downtown Cinema' }, { name: 'Suburbia Screens' }]

  await prisma.theatres.createMany({
    data: theatres,
    skipDuplicates: true,
  })
}

// ========== HALLS ==========
async function createHalls(theatres: { id: number; name: string }[]) {
  if (!theatres || theatres.length === 0 || !theatres[0]) {
    throw new Error('Theatres list has no values after seed')
  }
  await prisma.halls.createMany({
    data: [
      { name: 'Hall A', theatre_id: theatres[0].id, capacity: 150 },
      { name: 'Hall B', theatre_id: theatres[0].id, capacity: 80 },
    ],
    skipDuplicates: true,
  })
}

// ========== SEATS ==========
interface seatsType {
  hall_id: number
  row_label: string
  seat_number: number
  is_available: number
}

async function createSeats() {
  const createSeatMatrix = (hall_id: number, rows: Array<string>, columns: number): seatsType[] => {
    const seats: seatsType[] = []

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= columns; j++) {
        const label = rows[i]
        if (!label) {
          throw new Error(`exceeded rows array i=${i} j=${j}. returned undefined for rows[i]`)
        }
        seats.push({ hall_id, row_label: label, seat_number: j, is_available: 1 })
      }
    }

    return seats
  }

  const rows = ['A', 'B', 'C', 'D', 'E']
  const seats1 = createSeatMatrix(1, rows, rows.length)
  const seats2 = createSeatMatrix(2, rows, rows.length)

  await prisma.seats.createMany({
    data: seats1,
    skipDuplicates: true,
  })
  await prisma.seats.createMany({
    data: seats2,
    skipDuplicates: true,
  })

  console.log('seeded Seats in halls_id 1 and 2')
}

// ========== SHOWTIMES ==========
async function createShowtimes() {
  const showtimes = [
    {
      film_id: 1,
      hall_id: 1,
      starts_at: new Date('2025-11-01T18:00:00'),
      ends_at: new Date('2025-11-01T20:00:00'),
      price: 12.5,
      is_canceled: false,
    },
    {
      film_id: 2,
      hall_id: 2,
      starts_at: new Date('2025-11-01T20:30:00'),
      ends_at: new Date('2025-11-01T22:45:00'),
      price: 10.0,
      is_canceled: false,
    },
  ]

  await prisma.showtimes.createMany({
    data: showtimes,
    skipDuplicates: true,
  })
}

// ========== ORDERS ==========
async function createOrdersForUser(user) {
  await prisma.orders.createMany({
    data: [
      { user_id: user.id, status: 'pending', expires_at: new Date('2025-11-01T19:00:00') },
      { user_id: user.id, status: 'paid', expires_at: null },
    ],
    skipDuplicates: true,
  })
}

// ========== TICKETS ==========
async function createTickets() {
  const tickets: Prisma.ticketsCreateManyInput[] = [
    {
      order_id: 1,
      showtime_id: 1,
      seat_id: 1,
      unit_price: 12.5,
      ticket_code: 'TICKET-001',
      status: 'reserved',
    },
    {
      order_id: 2,
      showtime_id: 2,
      seat_id: 4,
      unit_price: 10.0,
      ticket_code: 'TICKET-002',
      status: 'reserved',
    },
  ]

  await prisma.tickets.createMany({
    data: tickets,
    skipDuplicates: true,
  })
}

// ===================================================== TRIGGERS =====================================================
async function preventAdminBuyTickets() {
  //admin cannot create a ticket when an order doesn't exist for it.
  //to insert a ticket you need an order_id
  await prisma.$executeRawUnsafe(`
  DROP TRIGGER IF EXISTS prevent_admin_buy_tickets;
`)
  await prisma.$executeRawUnsafe(`
  CREATE TRIGGER prevent_admin_buy_tickets
  BEFORE UPDATE ON orders
  FOR EACH ROW
  BEGIN
    DECLARE user_role VARCHAR(10);
    SELECT r.code INTO user_role
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = NEW.user_id
    LIMIT 1;
    IF user_role = 'admin' THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Admin cannot make purchases';
    END IF;
  END;
`)
}

;(async () => {
  try {
    await runSeed().then(() => prisma.$disconnect)

    console.log('Seed completed successfully!')
  } catch (err) {
    console.error('Error during seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
})()
