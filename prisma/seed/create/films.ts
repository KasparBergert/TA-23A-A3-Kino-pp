import prisma from '../../../Backend/db'

export async function createFilms() {
  await prisma.films.createMany({
    data: [
      {
        title: 'The Dark Knight',
        description: 'A gritty rise of Gotham’s silent guardian.',
        release_date: new Date('2008-07-18'),
        duration_min: 152,
        poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      },
      {
        title: 'Inception',
        description: 'A thief enters dreams to plant an idea.',
        release_date: new Date('2010-07-16'),
        duration_min: 148,
        poster_url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      },
      {
        title: 'Interstellar',
        description: 'Humanity searches among the stars for hope.',
        release_date: new Date('2014-11-07'),
        duration_min: 169,
        poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      },
      {
        title: 'The Matrix',
        description: 'A hacker discovers reality is a simulation.',
        release_date: new Date('1999-03-31'),
        duration_min: 136,
        poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      },
      {
        title: 'Gladiator',
        description: 'A betrayed general seeks revenge in Rome.',
        release_date: new Date('2000-05-05'),
        duration_min: 155,
        poster_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      },
      {
        title: 'The Shawshank Redemption',
        description: 'A banker fights for hope inside prison walls.',
        release_date: new Date('1994-10-14'),
        duration_min: 142,
        poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      },
      {
        title: 'Fight Club',
        description: 'An insomniac meets a charismatic soap maker.',
        release_date: new Date('1999-10-15'),
        duration_min: 139,
        poster_url: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
      },
      {
        title: 'Pulp Fiction',
        description: 'Crime stories interwoven in Los Angeles.',
        release_date: new Date('1994-10-14'),
        duration_min: 154,
        poster_url: 'https://image.tmdb.org/t/p/w500/plnlrtBUULT0rh3Xsjmpubiso3L.jpg',
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'A journey begins to destroy a dark ring.',
        release_date: new Date('2001-12-19'),
        duration_min: 178,
        poster_url: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
      },
      {
        title: 'The Lord of the Rings: The Return of the King',
        description: 'The final battle for Middle-earth.',
        release_date: new Date('2003-12-17'),
        duration_min: 201,
        poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      },
      {
        title: 'The Social Network',
        description: 'A story of ambition and betrayal at Harvard.',
        release_date: new Date('2010-10-01'),
        duration_min: 120,
        poster_url: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
      },
    ],
    skipDuplicates: true,
  })
}
