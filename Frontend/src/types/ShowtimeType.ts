import Film from "./Film";
import Hall from "./Halls";

interface ShowtimeType {
  ends_at: string;
  starts_at: string;
  film: Film;
  hall: Hall;
  theatre_name: number;
}

export default ShowtimeType
