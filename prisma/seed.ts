import prisma from "../Backend/database/db";

async function runSeed(){

  // ========== ROLES ==========
  const roles = await prisma.roles.createMany({
    data: [
      { code: 'admin' },
      { code: 'user' },
    ],
    skipDuplicates: true,
  });

  // ========== USERS ==========
  const users = await prisma.users.createMany({
    data: [
      { email: 'alice@example.com',   hashed_password: 'hashed_pw_alice' },
      { email: 'bob@example.com',     hashed_password: 'hashed_pw_bob'   },
      { email: 'charlie@example.com', hashed_password: 'hashed_pw_charlie' },
    ],
    skipDuplicates: true,
  });

  // ========== USER_ROLES (linking) ==========
  await prisma.user_roles.createMany({
    data: [
      { user_id: 1, role_id: 1 }, // alice is admin
      { user_id: 2, role_id: 2 }, // bob is user
      { user_id: 3, role_id: 2 }, // charlie is user
    ],
    skipDuplicates: true,
  });

  // ========== FILMS ==========
  await prisma.films.createMany({
    data: [
      {
        title: 'The First Movie',
        description: 'An epic beginning.',
        release_date: new Date('2020-01-01'),
        duration_min: 120,
        poster_url: 'https://example.com/poster1.jpg',
      },
      {
        title: 'Another Great Film',
        description: 'Sequel to the epic.',
        release_date: new Date('2021-06-15'),
        duration_min: 135,
        poster_url: 'https://example.com/poster2.jpg',
      },
      {
        title: 'Indie Hit',
        description: 'Low budget, high heart.',
        release_date: new Date('2019-11-02'),
        duration_min: 95,
        poster_url: 'https://example.com/poster3.jpg',
      },
    ],
    skipDuplicates: true,
  });

  // ========== GENRES ==========
  await prisma.genres.createMany({
    data: [
      { name: 'Action' },
      { name: 'Drama' },
      { name: 'Comedy' },
      { name: 'Sci-Fi' },
    ],
    skipDuplicates: true,
  });

  // ========== FILM_GENRES (linking) ==========
  await prisma.film_genres.createMany({
    data: [
      { film_id: 1, genre_id: 1 }, // The First Movie → Action
      { film_id: 1, genre_id: 4 }, // The First Movie → Sci-Fi
      { film_id: 2, genre_id: 2 }, // Another Great Film → Drama
      { film_id: 3, genre_id: 3 }, // Indie Hit → Comedy
    ],
    skipDuplicates: true,
  });

  // ========== THEATRES ==========
  await prisma.theatres.createMany({
    data: [
      { name: 'Downtown Cinema' },
      { name: 'Suburbia Screens' },
    ],
    skipDuplicates: true,
  });

  // ========== HALLS ==========
  await prisma.halls.createMany({
    data: [
      { name: 'Hall A', capacity: 150 },
      { name: 'Hall B', capacity: 80 },
    ],
    skipDuplicates: true,
  });

  // ========== THEATRE_HALLS (linking) ==========
  await prisma.theatre_halls.createMany({
    data: [
      { theatre_id: 1, hall_id: 1 }, // Downtown Cinema -> Hall A
      { theatre_id: 1, hall_id: 2 }, // Downtown Cinema -> Hall B
      { theatre_id: 2, hall_id: 2 }, // Suburbia Screens -> Hall B
    ],
    skipDuplicates: true,
  });

  // ========== SEATS ==========
  await prisma.seats.createMany({
    data: [
      { hall_id: 1, row_label: 'A', seat_number: 1 },
      { hall_id: 1, row_label: 'A', seat_number: 2 },
      { hall_id: 1, row_label: 'B', seat_number: 1 },
      { hall_id: 2, row_label: 'A', seat_number: 1 },
      { hall_id: 2, row_label: 'A', seat_number: 2 },
    ],
    skipDuplicates: true,
  });

  // ========== SHOWTIMES ==========
  await prisma.showtimes.createMany({
    data: [
      {
        film_id:   1,
        hall_id:   1,
        starts_at: new Date('2025-11-01T18:00:00'),
        ends_at:   new Date('2025-11-01T20:00:00'),
        price:     12.50,
        is_canceled: false,
      },
      {
        film_id:   2,
        hall_id:   2,
        starts_at: new Date('2025-11-01T20:30:00'),
        ends_at:   new Date('2025-11-01T22:45:00'),
        price:     10.00,
        is_canceled: false,
      },
    ],
    skipDuplicates: true,
  });

  // ========== ORDERS ==========
  await prisma.orders.createMany({
    data: [
      { user_id: 2, status: 'pending', expires_at: new Date('2025-11-01T19:00:00') },
      { user_id: 3, status: 'paid',    expires_at: null },
    ],
    skipDuplicates: true,
  });

  // ========== TICKETS ==========
  await prisma.tickets.createMany({
    data: [
      {
        order_id:    1,
        showtime_id: 1,
        seat_id:     1,
        unit_price:  12.50,
        ticket_code: 'TICKET-001',
        status:      'reserved',   // default was reserved in your schema
      },
      {
        order_id:    2,
        showtime_id: 2,
        seat_id:     4,
        unit_price:  10.00,
        ticket_code: 'TICKET-002',
        status:      'reserved',
      },
    ],
    skipDuplicates: true,
  });

}

runSeed().then(() => prisma.$disconnect).catch((err) => {console.log(err)})
