<script setup lang="ts">
import { onMounted, ref } from "vue";
import Seat from "./SeatGrid/Seat.vue";
import { seatService } from "../../entities/SeatService";
import SeatDTO from "../../../../shared/types/SeatDTO";
import { toast } from "@steveyuowo/vue-hot-toast";

const props = defineProps<{
  hallId: number;
  showtimeId: number;
}>();

const emit = defineEmits<{
  (e: "update:selected-seats-ids", seats_ids: number[]): void;
}>();

const seatGrid = ref<Record<string, Set<SeatDTO>>>({}); //used for rendering only
const selectedSeatsIds = ref<Set<number>>(new Set());

//builds the seat grid for rendering only
function buildSeatGrid(seats: SeatDTO[]): Record<string, Set<SeatDTO>> {
  const seatGrid: Record<string, Set<SeatDTO>> = {};

  for(const seat of seats){
    //make new entry into seatGrid
    const seat_row = seatGrid[seat.row] ??= new Set()
    seat_row.add(seat);
  }

  return seatGrid;
}

onMounted(async () => {
  try {
    const hallId = Number(props.hallId);
    const showtimeId = Number(props.showtimeId);

    const seats_fetched = await seatService.get(showtimeId, hallId);
    seatGrid.value = buildSeatGrid(seats_fetched);
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
});

function handleSeatClick(seat_id: number) {
  selectedSeatsIds.value.has(seat_id)
    ? selectedSeatsIds.value.delete(seat_id)
    : selectedSeatsIds.value.add(seat_id);
  emit("update:selected-seats-ids", Array.from(selectedSeatsIds.value));
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
          @seat-clicked="handleSeatClick(seat.id)"
        />
      </div>
    </div>
  </div>
</template>

