import type { film, hall, showtime, theatre } from '@prisma/client'
import type ShowtimeFilters from '../../../shared/types/ShowtimeFilter.ts'
import type ShowtimeDTO from "../../../shared/types/ShowtimeDTO.ts"
import type SeatDTO from '../../../shared/types/SeatDTO.ts';
import showtimeFilter from '../filters/ShowtimeFilter.ts'
import showtimeRepository from '../repositories/ShowtimeRepository.ts'
import hallRepositroy from '../repositories/HallRepository.ts'
import filmRepository from '../repositories/FilmRepository.ts'
import theatreRepository from '../repositories/TheatreRepository.ts'
import seatRepository from '../repositories/SeatRepository.ts'
import seatAvailabilityRepository from '../repositories/ShowtimeTakenSeat.ts'

class ShowtimeService {
  private async loadEntities<T>(
    ids: number[],
    loader: (id: number[]) => Promise<T[]>,
    notFound: string,
  ): Promise<T[]> {
    const result = await loader(ids)
    if (result.length === 0) {
      throw new Error(notFound)
    }
    return result
  }

  private async getShowtimeFilms(filmIds: number[]): Promise<film[]> {
    return await this.loadEntities(filmIds, filmRepository.getByIds, 'FILM_NOT_FOUND')
  }

  private async getShowtimeHalls(hallIds: number[]): Promise<hall[]> {
    return await this.loadEntities(hallIds, hallRepositroy.getByIds, 'HALL_NOT_FOUND')
  }

  private async getShowtimeTheatres(hallIds: number[]): Promise<theatre[]> {
    return await this.loadEntities(hallIds, theatreRepository.getByIds, 'THEATRE_NOT_FOUND')
  }

  async exists(filter: ShowtimeFilters): Promise<boolean>{
    const showtimeFilters = await showtimeFilter.build(filter)
    const showtime = await showtimeRepository.getAll(showtimeFilters)
    return showtime.length === 0 ? false : true;
  }

  async getHallSeats(hallId: number, showtimeId: number): Promise<SeatDTO[]> {
    //much more efficient way of this algorithim would work with sets, but this works too.

    //hallSeats for showtime don't exist when showtime itself with the id's doesn't exist
    if(!await this.exists({hallId, showtimeId})){
      throw new Error("Cannot get seat's for a showtime that doesn't exist")
    }

    const seats = await seatRepository.getByHallId(hallId);
    const taken_seats = await seatAvailabilityRepository.getTakenSeats(showtimeId);

    return seats.map((seat) => {
      let isTaken: boolean = false
      //find taken seat if exists.
      for(const taken_seat of taken_seats){
        if(seat.id === taken_seat.seatId){ isTaken = true; break; } //taken seat found.
      }

      return {
        id: seat.id,
        hallId: seat.hallId,
        type: seat.type,
        row: seat.row,
        isTaken
      }
    })
  }

  async getAll(filters: ShowtimeFilters): Promise<showtime[]> {
    const builtFilters = await showtimeFilter.build(filters)
    return await showtimeRepository.getAll(builtFilters)
  }

  async getShowtimeDTOs(filters: ShowtimeFilters): Promise<ShowtimeDTO[]>  {
    //creates the desired look for the showtime object
    const showtimes = await this.getAll(filters)

    const filmIds = showtimes.map((st) => st.filmId)
    const hallIds = showtimes.map((st) => st.hallId)

    const films = await this.getShowtimeFilms(filmIds)
    const halls = await this.getShowtimeHalls(hallIds)

    const theatreIds = halls.map((h) => h.theatreId)

    const theatres = await this.getShowtimeTheatres(theatreIds)

    //create the output
    return showtimes.map((st) => {
      const film = films.find((f) => st.filmId === f.id)!
      const hall = halls.find((h) => st.hallId === h.id)!
      const theatre = theatres.find((t) => t.id === hall.theatreId)!

      return {
        id: st.id,
        endsAt: st.endsAt,
        isCanceled: st.isCanceled,
        startsAt: st.startsAt,
        film: {
          id: film.id,
          title: film.title,
          description: film.description,
          durationMin: film.durationMin,
          posterUrl: film.posterUrl,
          releaseDate: film.releaseDate,
        },
        hall: {
          id: hall.id,
          name: hall.name,
          capacity: hall.capacity,
        },
        theatre: {
          id: theatre.id,
          name: theatre.name,
        },
      }
    })
  }
}

const showtimeService = new ShowtimeService()
export default showtimeService
