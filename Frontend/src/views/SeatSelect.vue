<script setup lang="ts">
import { ref } from 'vue';
import SeatGrid from '../components/SeatGrid/SeatGrid.vue';
import type SeatDTO from '../../../shared/types/SeatDTO';
import orderStore from '../store/OrderStore';
import { useValidation } from '../utils/useValidation';
import FilmDTO from '../../../shared/types/FilmDTO';
import useSafeRouter from '../utils/useSafeRouter';
import Screen from './components/Screen.vue';
import TheSummaryCard from '../components/TheSummaryCard/TheSummaryCard.vue';

const { safeRoute } = useSafeRouter();
const hall_id: number = useValidation.useValidatedNumberQuery('hall_id');

const film: FilmDTO | null = orderStore.getFilm();
if (film === null) {
  console.error("Film doesn't exit")
  safeRoute('/');
}

const selectedSeats = ref<SeatDTO[]>([]);

</script>
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 flex items-center justify-center p-4 md:p-6">

    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 relative">
      <div
        class="lg:col-span-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 border border-slate-700/50 p-4 md:p-8 flex flex-col items-center justify-start min-h-[500px]">
        <Screen />
        <div class="w-full overflow-x-auto flex justify-center">
          <SeatGrid :hallId="hall_id" v-model:selected-seats="selectedSeats" />
        </div>
      </div>

      <div class="lg:col-span-1">
        <TheSummaryCard :film="film" :seats="selectedSeats" />
      </div>
    </div>
  </div>
</template>
