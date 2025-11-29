<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { showtimeService } from '../services/ShowtimeService';
import { theatreService } from '../services/TheatreService';
import type { theatres } from '@prisma/client';
import type ShowtimeDTO from '../../../shared/types/ShowtimeDTO';
import ShowtimesGrid from '../components/ShowtimesGrid/ShowtimesGrid.vue';

const route = useRoute();
const theatreId = route.query.theatre_id as string;

const theatre = ref<theatres>({
  name: '...',
  id: 0
});
const showtimesList = ref<ShowtimeDTO[]>([]);

function setTheatres(theatreData: theatres) {
  theatre.value = theatreData;
}

function setShowtimes(showtimeData: ShowtimeDTO[]) {
  showtimesList.value = showtimeData;
}

onMounted(async () => {
  const theatre_id = Number(theatreId);

  const theatreRes = await theatreService.getTheatreDetails(theatre_id);
  const showtimesRes = await showtimeService.getShowtimes({ theatre_id: theatre_id })
  setTheatres(theatreRes.theatre);
  setShowtimes(showtimesRes.showtimes);
});


</script>
<template>

  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-12 px-4 sm:px-6">

    <div class="relative z-10 flex flex-col w-full max-w-7xl space-y-10">

      <section class="flex flex-col items-center justify-center text-center mt-4 mb-8">
        <h1
          class="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-lg">
          {{ theatre.name }}
        </h1>
        <div class="h-1 w-24 bg-blue-600 rounded-full mt-6 shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
      </section>

      <ShowtimesGrid :showtimes="showtimesList" />

    </div>
  </main>

</template>
