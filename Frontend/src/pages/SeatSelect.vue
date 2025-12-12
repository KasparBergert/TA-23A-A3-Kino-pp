<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SeatGrid from '../features/seat/SeatGrid.vue';
import type SeatDTO from '../../../shared/types/SeatDTO';
import orderStore from '../store/OrderStore';
import { useValidation } from '../utils/useValidation';
import type FilmDTO from '../../../shared/types/FilmDTO';
import useSafeBack from '../utils/useSafeBack';
import Screen from '../widgets/Screen.vue';
import TheSummaryCard from '../features/booking/TheSummaryCard.vue';
import { useRouter } from 'vue-router';
import client from '../utils/api';

const { safeBack } = useSafeBack();
const router = useRouter();
const hall_id: number = useValidation.getNumberQueryParam('hall_id');
const film: FilmDTO = getFilmOrRedirect();

function getFilmOrRedirect(): FilmDTO {
  const film = orderStore.getFilm()
  if (!film) {
    safeBack('/')
    throw new Error('film missing')
  }
  return film
}

const selectedSeatsIds = ref<number[]>([]);
function proceedToPayment() {
  orderStore.setChosenSeats(selectedSeatsIds.value);  
  router.push({ name: 'payment' });
}

</script>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 flex items-center justify-center p-4 md:p-6">

    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_25%] gap-6 lg:gap-8 relative">
      <div
        class="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 border border-slate-700/50 p-4 md:p-8 flex flex-col items-center justify-start min-h-[500px]">
        <Screen />
        <div class="w-full overflow-x-auto flex justify-center">
          <SeatGrid :hall_id="hall_id" v-model:selected-seats-ids="selectedSeatsIds" />
        </div>
      </div>

      <TheSummaryCard :film="film" :seats="selectedSeatsIds" />

      <button @click="proceedToPayment"
        class="lg:col-start-2 w-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-indigo-500/30 outline-none">
        Maksma
      </button>
    </div>

  </div>

</template>
