<script lang="ts" setup>
import SeatSVG from '../assets/SeatSVG.vue';
import Seat from '../types/Seat';
import { ref } from 'vue';

const { seats } = defineProps<{ seats: Seat[]; }>()

const emit = defineEmits<{ (e: 'update:selected-seats', value: any): void; }>()

const seatStates = ref(seats.map((seat) => { return { ...seat, is_selected: false } }));

const rowCount = Array.from(new Set(seats.map(seat => seat.row))).length;
const colCount = Math.max(...seats.map(seat => seat.col)) + 1;

const handleSeatClick = (seat: Seat) => {
  const { is_available } = seat;
  if (!is_available) { return; }
  seat.is_selected = !seat.is_selected;
  emit('update:selected-seats', seatStates.value.filter(s => s.is_selected ));
}

</script>
<template>
  <div class="seat-layout w-fill min-w-md select-none cursor-pointer justify-items-center items-center"
    :style="{ '--rows': rowCount, '--cols': colCount }">
    <SeatSVG
    :is_available="seat.is_available ?? false"
    :is_selected="seat.is_selected ?? false"
    v-for="seat, key in seatStates" :key="key"
    class="w-8 h-8 transform rotate-180"
    @click="handleSeatClick(seat)" />
  </div>
</template>
<style scoped>
.seat-layout {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(40px, min-content));
  grid-template-rows: repeat(var(--rows), minmax(40px, min-content));
  gap: 0.6rem 0rem;
  justify-content: center;
  align-items: center;
}
</style>
