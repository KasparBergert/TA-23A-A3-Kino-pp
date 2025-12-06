<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Seat from './SeatGrid/Seat.vue';
import { seatService } from '../../entities/SeatService';
import SeatDTO from '../../../../shared/types/SeatDTO';
import { toast } from '@steveyuowo/vue-hot-toast';

const props = defineProps<{
  hall_id: number
}>();

const emit = defineEmits<{
  (e: 'update:selected-seats', seats: SeatDTO[]): void
}>();

const seatGrid = ref<Record<string, SeatDTO[]>>({});
const selectedSeats = ref<Set<SeatDTO>>(new Set());

function buildSeatGrid(seats: SeatDTO[]): Record<string, SeatDTO[]> {
  const seatGrid: Record<string, SeatDTO[]> = {}
  seats.forEach((seat) => {
    (seatGrid[seat.row_label] ??= []).push(seat)
  })
  return seatGrid
}

onMounted(async () => {
  try {
    const hall_id = Number(props.hall_id);
    if (Number.isNaN(hall_id)) throw new Error("Hall_id is not a number")

    const seats_fetched = await seatService.get(hall_id);
    console.log(seats_fetched)
    seatGrid.value = buildSeatGrid(seats_fetched);
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
});

function handleSeatClick(seat: SeatDTO) {
  selectedSeats.value.has(seat)
    ? selectedSeats.value.delete(seat)
    : selectedSeats.value.add(seat);
  emit('update:selected-seats', Array.from(selectedSeats.value));
}

</script>
<template>
  <div class="flex flex-col items-center">
    <div v-for="(seats, row) in seatGrid" :key="row" class="relative w-full flex justify-center">
      <!-- Label sticks to left of the seat block -->
      <p class="absolute right-100 mr-20 select-none font-bold text-xl">
        {{ row }}
      </p>

      <!-- Seats -->
      <div class="relative flex justify-center">
        <div v-for="seat in seats" :key="seat.id" class="px-1">
          <Seat :seat="seat" @seat-clicked="handleSeatClick(seat)" />
        </div>
      </div>
    </div>
  </div>


</template>

