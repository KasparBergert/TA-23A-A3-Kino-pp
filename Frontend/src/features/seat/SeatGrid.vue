<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Seat from './SeatGrid/Seat.vue';
import { seatService } from '../../entities/SeatService';
import SeatDTO from '../../../../shared/types/SeatDTO';
import { toast } from '@steveyuowo/vue-hot-toast';
import { seats_type } from '@prisma/client';

const props = defineProps<{
  hall_id: number
}>();

const emit = defineEmits<{
  (e: 'update:selected-seats', seats: SeatDTO[]): void
}>();

const seatGrid = ref<Record<string, Set<SeatDTO>>>({});
const selectedSeats = ref<Set<SeatDTO>>(new Set());

function buildSeatGrid(seats: SeatDTO[]): Record<string, Set<SeatDTO>> {
  const seatGrid: Record<string, Set<SeatDTO>> = {}
  seats.forEach((seat) => {
    (seatGrid[seat.row_label] ??= new Set()).add(seat);
  })
  return seatGrid
}

onMounted(async () => {
  try {
    const hall_id = Number(props.hall_id);
    if (Number.isNaN(hall_id)) throw new Error("Hall_id is not a number")

    const seats_fetched = await seatService.get(hall_id);
    seatGrid.value = buildSeatGrid(seats_fetched);
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
});

function handleSeatClick(clicked_seat: SeatDTO) {

  //if type is double, then finds a seat with the same id as the param seat
  if (selectedSeats.value.has(clicked_seat)) {
    selectedSeats.value.delete(clicked_seat)
  } else {
    selectedSeats.value.add(clicked_seat);
    // when double seat, select the second seat too
    if (clicked_seat.type == seats_type.Double) {
      console.log(seatGrid[clicked_seat.row_label]);
      const seat_row: SeatDTO[] = seatGrid[clicked_seat.row_label]
      seat_row.forEach((seat: SeatDTO) => {
        if (seat.id === clicked_seat.id) {
          selectedSeats.value.add(seat);
        }
      })
    }
  }

  emit('update:selected-seats', Array.from(selectedSeats.value));
  console.log(selectedSeats.value)
}

</script>
<template>
  <div class="flex flex-col items-center">
    <div v-for="(seats, row) in seatGrid" :key="row" class="relative w-full flex justify-center">
      <p class="absolute right-100 mr-20 select-none font-bold text-xl">
        {{ row }}
      </p>

      <div class="relative flex justify-center">
        <div v-for="seat in seats" :key="seat.id">
          <Seat :seat="seat" @seat-clicked="handleSeatClick(seat)" />
        </div>
      </div>
    </div>
  </div>


</template>
