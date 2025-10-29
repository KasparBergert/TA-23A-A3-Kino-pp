

export interface Movie {
  id: number
  title: string
  genres?: string[]
  poster?: string
  summary: string
}

export const movies: Movie[] = [
  {
    id: 1,
    title: 'The Dark Knight',
    genres: ['Action', 'Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    summary:
      "Some description"
  },
  {
    id: 2,
    title: 'Inception',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    summary:
      "Some description Some description Some description Some description Some description Some description Some description Some description Some description Some description v v Some description"
  },
  {
    id: 3,
    title: 'Interstellar',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    summary:
      "Some description"
  },
]
