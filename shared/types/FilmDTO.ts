interface FilmDTO {
  id: number
  title: string
  description: string | null
  duration_min: number | null
  poster_url: string
  release_date: Date | null
}

export default FilmDTO
