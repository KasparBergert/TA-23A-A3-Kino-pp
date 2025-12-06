interface FilmDTO {
  id: number
  title: string
  description: string | null
  duration_min: number | null
  poster_url: string | null
  release_date: Date | null
}

export default FilmDTO
