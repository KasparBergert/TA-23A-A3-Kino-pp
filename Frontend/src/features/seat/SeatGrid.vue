<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Seat from './SeatGrid/Seat.vue';
import { seatService } from '../../entities/SeatService';
import SeatDTO from '../../../../shared/types/SeatDTO';
import { toast } from '@steveyuowo/vue-hot-toast';

const props = defineProps<{
  hallId: number
}>();

const emit = defineEmits<{
  (e: 'update:selected-seats', seats: SeatDTO[]): void
}>();

const OrganizedSeats = ref<SeatDTO[][]>([]);
const selectedSeats = ref<Set<SeatDTO>>(new Set());

onMounted(async () => {
  try {
    setOrganizedSeats(await seatService.getSeatsByRow(props.hallId));
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
});

function setOrganizedSeats(newSeats: SeatDTO[][]) {
  OrganizedSeats.value = newSeats
}

function handleSeatClick(seat: SeatDTO) {
  selectedSeats.value.has(seat)
    ? selectedSeats.value.delete(seat)
    : selectedSeats.value.add(seat);
  emit('update:selected-seats', Array.from(selectedSeats.value));
}

</script>
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex p-2" v-for="seats in OrganizedSeats">
      <div v-for="seat in seats" class="p-0.5">
        <Seat :seat="seat" @seat-clicked="handleSeatClick(seat)" />
      </div>
    </div>
  </div>
</template>
