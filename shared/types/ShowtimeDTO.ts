interface ShowtimeDTO {
  id: number
  ends_at: Date | null;
  is_canceled: boolean;
  price: number;
  starts_at: Date;

  film: {
    id: number;
    title: string;
    description: string | null;
    duration_min: number | null;
    poster_url: string | null;
    release_date: Date | null;
  };

  hall: {
    id: number;
    name: string;
    capacity: number;
  };

  theatre: {
    id: number;
    name: string;
  };
}


export default ShowtimeDTO
