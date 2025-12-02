import prisma from '../../../Backend/db'

export const filmSeed = [
  {
    title: 'The Dark Knight',
    description: 'Gotham descends into chaos as Batman faces the Joker in a clash of ideals, sacrifice, and fragile hope.',
    release_date: new Date('2008-07-18'),
    duration_min: 152,
    poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    title: 'Inception',
    description: 'A master thief leads a team into layered dreams to plant an idea while battling memories that threaten the mission.',
    release_date: new Date('2010-07-16'),
    duration_min: 148,
    poster_url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
  },
  {
    title: 'Interstellar',
    description: 'As Earth withers, a pilot joins a secret mission through a wormhole to find a new home for humanity.',
    release_date: new Date('2014-11-07'),
    duration_min: 169,
    poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'The Matrix',
    description: 'A hacker learns reality is a simulation and joins rebels to free humanity from the machines that control it.',
    release_date: new Date('1999-03-31'),
    duration_min: 136,
    poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  },
  {
    title: 'Gladiator',
    description: 'A betrayed Roman general rises as a gladiator, fighting for vengeance against the emperor who destroyed his family.',
    release_date: new Date('2000-05-05'),
    duration_min: 155,
    poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Wrongly imprisoned banker Andy Dufresne endures decades in Shawshank, forging a bond that sustains hope.',
    release_date: new Date('1994-10-14'),
    duration_min: 142,
    poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
  },
  {
    title: 'Fight Club',
    description: 'An insomniac and a charismatic soap maker create an underground fight club that spirals into anarchy.',
    release_date: new Date('1999-10-15'),
    duration_min: 139,
    poster_url: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
  },
  {
    title: 'Pulp Fiction',
    description: 'Interwoven tales of hitmen, boxers, and mobsters collide in a darkly comic Los Angeles crime saga.',
    release_date: new Date('1994-10-14'),
    duration_min: 154,
    poster_url: 'https://image.tmdb.org/t/p/w500/plnlrtBUULT0rh3Xsjmpubiso3L.jpg',
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    description: 'A humble hobbit and a fellowship of allies journey across Middle-earth to destroy the One Ring of power.',
    release_date: new Date('2001-12-19'),
    duration_min: 178,
    poster_url: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    description: 'Armies clash and destinies converge as the final push to destroy the Ring decides the fate of Middle-earth.',
    release_date: new Date('2003-12-17'),
    duration_min: 201,
    poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
  },
  {
    title: 'The Social Network',
    description: 'At Harvard, ambition and rivalry ignite the birth of Facebook, fracturing friendships in the race to own the idea.',
    release_date: new Date('2010-10-01'),
    duration_min: 120,
    poster_url: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
  },
]

export async function createFilms() {
  await prisma.films.createMany({
    data: filmSeed,
    skipDuplicates: true,
  })
}
