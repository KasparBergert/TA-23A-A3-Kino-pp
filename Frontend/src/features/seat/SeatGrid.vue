<script setup lang="ts">
import { onMounted, ref } from "vue";
import Seat from "./SeatGrid/Seat.vue";
import { seatService } from "../../entities/SeatService";
import SeatDTO from "../../../../shared/types/SeatDTO";
import { toast } from "@steveyuowo/vue-hot-toast";

const props = defineProps<{
  hall_id: number;
}>();

const emit = defineEmits<{
  (e: "update:selected-seats-ids", seats_ids: number[]): void;
}>();

const seatGrid = ref<Record<string, Set<SeatDTO>>>({}); //used for rendering only
const selectedSeatsIds = ref<Set<number>>(new Set());


//builds the seat grid for rendering only
function buildSeatGrid(seats: SeatDTO[]): Record<string, Set<SeatDTO>> {
  const existing_seats = new Set();
  const seatGrid: Record<string, Set<SeatDTO>> = {};
  seats.forEach((seat) => {
    const seat_set = seatGrid[seat.row_label] ??= new Set();
    if(!existing_seats.has(seat.id)){seat_set.add(seat);}
    existing_seats.add(seat.id);
  });
  return seatGrid;
}

onMounted(async () => {
  try {
    const hall_id = Number(props.hall_id);
    if (Number.isNaN(hall_id)) throw new Error("Hall_id is not a number");

    const seats_fetched = await seatService.get(hall_id);
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
  console.log(seat_id)
}

</script>
<template>
  <div class="w-full h-full flex flex-col items-center">
    <div v-for="(seats, row) in seatGrid" :key="row" class="relative flex justify-center w-full **min-w-fit**">
      <p class="select-none font-bold text-md absolute left-0">
        {{ row }}
      </p>

      <div class="flex justify-center gap-1 scale-[60%] md:scale-[100%]">
        <Seat v-for="seat in seats" :key="seat.id" :seat="seat" @seat-clicked="handleSeatClick(seat.id)" />
      </div>
    </div>
  </div>
</template>
