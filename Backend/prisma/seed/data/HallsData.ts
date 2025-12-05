import { halls } from "@prisma/client";
import { getRandomTheatre } from "../utils/fetch";

export const hallsSeed: Omit<halls, 'id'>[] = [
  { name: 'Hall A', theatre_id: getRandomTheatre().id, capacity: 150 },
  { name: 'Hall B', theatre_id: getRandomTheatre().id, capacity: 80 },
]
