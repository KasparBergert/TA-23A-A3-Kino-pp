<script setup lang="ts">
import type FilmDTO from '../../../../shared/types/FilmDTO';
import type SeatDTO from '../../../../shared/types/SeatDTO';
import orderStore from '../../store/OrderStore';
import { useRouter } from 'vue-router';
import Summary from './components/Summary.vue';
import FilmDetails from './components/FilmDetails.vue';

const route = useRouter();

const props = defineProps<{
  film: FilmDTO | null,
  seats: SeatDTO[]
}>();

function proceedToPayment() {
  orderStore.setChosenSeats(props.seats);
  route.push({ name: 'summary' });
}


</script>
<template>
  <div class="sticky">
    <div class="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6">
      <div v-if="film" class="flex flex-col items-center text-center space-y-5">

        <div class="relative group">
          <img :src="film.poster_url"
            class="w-full h-auto rounded-xl shadow-lg shadow-black/40 object-cover max-w-[200px] transition-transform group-hover:scale-105 duration-300"
            alt="Movie Poster" />
        </div>

        <FilmDetails :film="film" />
        <div class="w-full border-t border-slate-700/80 my-2"></div>
        <Summary :seats="seats" />

        <button @click="proceedToPayment"
          class="w-full py-3 px-6 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-indigo-500/30 outline-none">
          Maksma
        </button>

      </div>
      <div v-else class="flex flex-col items-center justify-center py-12 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p class="font-medium">Film ei ole enam saadaval</p>
      </div>
    </div>
  </div>
</template>
