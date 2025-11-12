<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import SeatSVG from "../assets/SeatSVG.vue";
import Seat from "../types/Seat";
import useTicketCreatorStore from "../stores/useTicketCreatorStore";

const props = withDefaults(
  defineProps<{
    noSelect?: boolean;
    presetSeats?: Seat[];
  }>(),
  {
    noSelect: false,
  }
);

const ticketStore = useTicketCreatorStore();
const seats = ticketStore.currentShowtimeSeats;

// --- Reactive seat state ---

const seatStates = ref(!props.presetSeats ? seats : props.presetSeats);

// --- Layout dimensions ---
const rowCount = Array.from(new Set(seats.map((seat) => seat.row))).length;
const colCount = Math.max(...seats.map((seat) => seat.col)) + 1;

// --- Handlers ---
function handleSeatClick(seat: Seat) {
  if (!seat.is_available || props.noSelect) return;

  seat.is_selected = !seat.is_selected;
  ticketStore.setChosenSeats(seatStates.value.filter((s) => s.is_selected));
}
</script>

<template>
  <p v-show="seatStates.length === 0" class="text-2xl font-bold text-red-400">
    Istmekohti pole
  </p>

  <div
    class="seat-layout w-full min-w-md select-none cursor-pointer justify-items-center items-center"
    :style="{ '--rows': rowCount, '--cols': colCount }"
  >
    <SeatSVG
      v-for="(seat, index) in seatStates"
      :key="index"
      :is_available="seat.is_available ?? false"
      :is_selected="seat.is_selected ?? false"
      class="w-8 h-8 transform rotate-180"
      @click="handleSeatClick(seat)"
    />
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
