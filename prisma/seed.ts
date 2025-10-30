import prisma from '../Backend/database/db'

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

const getHallByName = async (name: string) => {
  const hall = await prisma.halls.findUnique({ where: { name } })
  if (!hall) throw new Error(`Hall "${name}" not found after seed`)
  return hall
}

async function runSeed() {
  // ========== ROLES ==========
  await createRoles()
  await createUsers()

  const [admin, user] = await Promise.all([getRoleByCode('admin'), getRoleByCode('user')])

  const [alice, bob] = await Promise.all([
    getUserByEmail('alice@example.com'),
    getUserByEmail('bob@example.com'),
  ])
  // ========== USER_ROLES (linking) ==========
  await prisma.user_roles.createMany({
    data: [
      { user_id: alice.id, role_id: admin.id },
      { user_id: bob.id, role_id: user.id },
    ],
    skipDuplicates: true,
  })

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
  await createHalls()

  const [downtown, suburbia] = await Promise.all([
    getTheatreByName('Downtown Cinema'),
    getTheatreByName('Suburbia Screens'),
  ])

  const [hallA, hallB] = await Promise.all([getHallByName('Hall A'), getHallByName('Hall B')])

  // ========== THEATRE_HALLS (linking) ==========
  await prisma.theatre_halls.createMany({
    data: [
      { theatre_id: downtown.id, hall_id: hallA.id }, // Downtown Cinema → Hall A
      { theatre_id: downtown.id, hall_id: hallB.id }, // Downtown Cinema → Hall B
      { theatre_id: suburbia.id, hall_id: hallB.id }, // Suburbia Screens → Hall B
    ],
    skipDuplicates: true,
  })

  // ========== SEATS ==========
  await createSeats()

  // ========== SHOWTIMES ==========
  await createShowtimes()

  // ========== ORDERS ==========
  await createOrders()

  // ========== TICKETS ==========
  await createTickets()
}

runSeed()
  .then(() => prisma.$disconnect)
  .catch((err) => {
    console.error(err)
  })

async function createRoles() {
  const roles = [{ code: 'admin' }, { code: 'user' }]

  await prisma.roles.createMany({
    data: roles,
    skipDuplicates: true,
  })
}

async function createUsers() {
  const users = [
    {
      email: 'alice@example.com',
      hashed_password:
        '$argon2id$v=19$m=65535,t=2,p=6$OS0pKEBtYjtvcGV3ZWY$aFG+Yn7dwfCVJkRZEZdm62GZ6DHl1WOHFSYcg7izQPzVQoOvgtHvReNDbkAcxqL6y4ZKas2HblGG+GG0tPqbRQ',
    },
    {
      email: 'bob@example.com',
      hashed_password:
        '$argon2id$v=19$m=65535,t=2,p=6$OS0pKEBtYjtvcGV3ZWY$aFG+Yn7dwfCVJkRZEZdm62GZ6DHl1WOHFSYcg7izQPzVQoOvgtHvReNDbkAcxqL6y4ZKas2HblGG+GG0tPqbRQ',
    },
  ]

  await prisma.users.createMany({
    data: users,
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
async function createHalls() {
  const halls = [
    { name: 'Hall A', capacity: 150 },
    { name: 'Hall B', capacity: 80 },
  ]

  await prisma.halls.createMany({
    data: halls,
    skipDuplicates: true,
  })
}

// ========== SEATS ==========
async function createSeats() {
  const seats = [
    { hall_id: 1, row_label: 'A', seat_number: 1 },
    { hall_id: 1, row_label: 'A', seat_number: 2 },
    { hall_id: 1, row_label: 'B', seat_number: 1 },
    { hall_id: 2, row_label: 'A', seat_number: 1 },
    { hall_id: 2, row_label: 'A', seat_number: 2 },
  ]

  await prisma.seats.createMany({
    data: seats,
    skipDuplicates: true,
  })
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
async function createOrders() {
  const orders = [
    { user_id: 2, status: 'pending', expires_at: new Date('2025-11-01T19:00:00') },
    { user_id: 3, status: 'paid', expires_at: null },
  ]

  await prisma.orders.createMany({
    data: orders,
    skipDuplicates: true,
  })
}

// ========== TICKETS ==========
async function createTickets() {
  const tickets = [
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
