<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Seat from './components/Seat.vue';
import client from '../../utils/api';
import SeatDTO from '../../../../shared/types/SeatDTO';
import { toast } from '@steveyuowo/vue-hot-toast';

const props = defineProps<{
  hallId: string
}>();

const emit = defineEmits<{
  (e: 'update:selected-seats', seats: SeatDTO[]): void
}>();

const OrganizedSeats = ref<SeatDTO[][]>([]);
const selectedSeats = ref<Set<SeatDTO>>(new Set());



onMounted(async () => {
  try {
    setOrganizedSeats(await getOrganizedSeats());
  } catch (err) {
    toast.error(err);
    console.error("Error fetching seats:", err);
  }
});

function setOrganizedSeats(newSeats: SeatDTO[][]) {
  OrganizedSeats.value = newSeats
}

async function fetchSeats(): Promise<SeatDTO[]> {
  const res = await client.get(`/showtimes/${props.hallId}/seats`)

  if (res.length === 0) {
    throw "No seats found for this hall";
  }

  return res;
}

async function getOrganizedSeats(): Promise<SeatDTO[][]> {
  const seats = await fetchSeats();

  const seatRows: SeatDTO[][] = [];

  //get all the unique rows
  const rows = new Set<string>();
  seats.forEach(seat => {
    rows.add(seat.row_label);
  });

  rows.forEach(row => {
    seatRows.push(seats.filter(seat => seat.row_label === row));
  })

  return seatRows;
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
