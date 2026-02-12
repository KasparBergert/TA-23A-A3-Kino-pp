<script setup lang="ts">
import { onMounted, shallowRef, ref, watch } from "vue";
import Seat from "./SeatGrid/Seat.vue";
import { seatService } from "../../entities/SeatService";
import SeatDTO from "../../../../shared/types/SeatDTO";
import { toast } from "@steveyuowo/vue-hot-toast";
import seatsCache from "../../store/seatsCache";

const props = defineProps<{
  hallId: number;
  showtimeId: number;
}>();

const emit = defineEmits<{
  (e: "update:selected-seats-ids", seats_ids: number[]): void;
}>();


const seatGrid = ref<Record<string, Set<SeatDTO>>>({}); //used for rendering only
const selectedSeatsIds = shallowRef<Set<number>>(new Set<number>());

//builds the seat grid for rendering only
function buildSeatGrid(seats: SeatDTO[]): Record<string, Set<SeatDTO>> {
  const seatGrid: Record<string, Set<SeatDTO>> = {};
  const existing_seats: Set<number> = new Set();

  for(const seat of seats){
    //make new entry into seatGrid
    const seat_row = seatGrid[seat.row] ??= new Set()

    //check for duplicates      |    add seat if isn't duplicate
    if(!existing_seats.has(seat.id)) seat_row.add(seat);
    existing_seats.add(seat.id)
  }

  return seatGrid;
}

async function loadSeats() {
  try {
    const hallId = Number(props.hallId);
    const showtimeId = Number(props.showtimeId);

    seatsCache.clear();
    selectedSeatsIds.value = new Set();
    emit("update:selected-seats-ids", []);

    const seats_fetched = await seatService.get(showtimeId, hallId);
    seatsCache.add(seats_fetched);
    seatGrid.value = buildSeatGrid(seats_fetched);
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
}

onMounted(loadSeats);

watch(
  () => [props.hallId, props.showtimeId],
  () => {
    loadSeats();
  }
);

function handleSeatClick(seat: SeatDTO) {
  selectedSeatsIds.value.has(seat.id)
    ? selectedSeatsIds.value.delete(seat.id)
    : selectedSeatsIds.value.add(seat.id);

  emit("update:selected-seats-ids", [...selectedSeatsIds.value]);
}

</script>
<template>
  <div class="w-full h-full flex flex-col items-center">
    <div
      v-for="(seats, row) in seatGrid"
      :key="row"
      class="flex items-center"
    >
      <p class="w-6 text-right mr-2 select-none font-bold text-md">
        {{ row }}
      </p>

      <div class="flex gap-1 scale-[60%] md:scale-100">
        <Seat
          v-for="seat in seats"
          :key="seat.id"
          :seat="seat"
          @seat-clicked="handleSeatClick(seat)"
        />
      </div>
    </div>
  </div>
</template>
