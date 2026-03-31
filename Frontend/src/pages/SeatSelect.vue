<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onUnmounted, computed } from 'vue';
import SeatGrid from '../features/seat/SeatGrid.vue';
import orderStore from '../store/OrderStore';
import { useValidation } from '../utils/useValidation';
import type FilmDTO from '../../../shared/types/FilmDTO';
import useSafeBack from '../utils/useSafeBack';
import Screen from '../widgets/Screen.vue';
import TheSummaryCard from '../features/booking/TheSummaryCard.vue';
import { useRouter } from 'vue-router';
import SeatDTO from '../../../shared/types/SeatDTO';
import seatsCache from '../store/SeatsCache';

const { safeBack } = useSafeBack();
const router = useRouter();
const hallId: number = useValidation.getNumberQueryParam('hallId');
const showtimeId: number = useValidation.getNumberQueryParam('showtimeId');
const film: FilmDTO = getFilmOrRedirect();

function getFilmOrRedirect(): FilmDTO {
  const film = orderStore.getFilm()
  if (!film) {
    safeBack('/')
    throw new Error('film missing')
  }
  return film
}

const selectedSeats = ref<SeatDTO[]>([]);
const selectedSeatsIds = ref<number[]>([]);
const holdEndsAt = ref<number | null>(orderStore.getHoldExpiresAt());
const now = ref(Date.now());
let tick: number | undefined;
let hydrateTimer: number | undefined;

function getSelectedSeats(): SeatDTO[] {
  //get seatGrid seats
  const seats = seatsCache.get();
  //get only the selected seats
  return seats.filter((seat) => {
    for (const id of selectedSeatsIds.value) {
      if (seat.id === id) return 1
    }
    return 0
  })
}

function proceedToPayment() {
  router.push({ name: 'payment' });
}

watch(selectedSeatsIds, () => {
  selectedSeats.value = getSelectedSeats();
  orderStore.setChosenSeats(selectedSeats.value);
})

const timeLeft = computed(() => {
  if (!holdEndsAt.value) return 0;
  return Math.max(0, holdEndsAt.value - now.value);
});

const isExpired = computed(() => timeLeft.value <= 0);

onMounted(() => {
  if (orderStore.isHoldExpired()) {
    orderStore.clear()
  }

  tick = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (tick) window.clearInterval(tick);
  if (hydrateTimer) window.clearInterval(hydrateTimer);
});

onMounted(() => {
  // Rehydrate previously chosen seats so user can keep editing after navigating back
  const savedSeats = orderStore.getChosenSeats();
  if (savedSeats?.length) {
    hydrateTimer = window.setInterval(() => {
      const cached = seatsCache.get();
      if (cached.length === 0) return;
      selectedSeatsIds.value = savedSeats.map((s) => s.id);
      selectedSeats.value = getSelectedSeats();
      if (hydrateTimer) window.clearInterval(hydrateTimer);
    }, 150);
  }
});

</script>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 flex items-center justify-center p-4 md:p-6">
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_25%] gap-6 lg:gap-8 relative">
      <div
        class="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 border border-slate-700/50 p-4 md:p-8 flex flex-col items-center justify-start min-h-[500px]">
        <Screen />
        <div class="w-full overflow-x-auto flex justify-center">
          <SeatGrid :hallId="hallId" :showtimeId="showtimeId" v-model:selected-seats-ids="selectedSeatsIds" />
        </div>
      </div>

      <TheSummaryCard :film="film" :seats="selectedSeats" />

      <div class="lg:col-start-2 w-full space-y-2">
        <div v-if="holdEndsAt" class="text-xs text-slate-300 text-center">
          Broneeringu aeg: {{ Math.floor(timeLeft / 60000).toString().padStart(2, '0') }}:{{ Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0') }}
        </div>

        <button @click="proceedToPayment" :disabled="selectedSeats.length === 0 || isExpired" :class="[
          selectedSeats.length === 0 || isExpired
            ? 'opacity-40 cursor-not-allowed pointer-events-none'
            : 'hover:-translate-y-0.5 active:translate-y-0']"
          class="w-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all focus:ring-4 focus:ring-indigo-500/30 outline-none">
          {{ isExpired ? 'Aeg sai läbi' : 'Kinnita broneering' }}
        </button>
      </div>
    </div>
  </div>
</template>
