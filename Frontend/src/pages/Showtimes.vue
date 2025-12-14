<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { showtimeService } from '../entities/ShowtimeService';
import { theatreService } from '../entities/TheatreService';
import type { theatre } from '@prisma/client';
import type ShowtimeDTO from '../../../shared/types/ShowtimeDTO';
import ShowtimesGrid from '../features/showtimes/ShowtimesGrid.vue';
import TheatresDTO from '../../../shared/types/TheatreDTO';

const route = useRoute();
const theatreId = route.query.theatreId as string;

const theatre = ref<theatre>({
  name: '...',
  id: 0
});
const showtimesList = ref<ShowtimeDTO[]>([]);

onMounted(async () => {
  const id = Number(theatreId);

  const theatreRes: TheatresDTO = await theatreService.getDetails(id);
  const showtimesRes: ShowtimeDTO[] = await showtimeService.get({ theatreId: id })

  theatre.value = theatreRes;
  showtimesList.value = showtimesRes;
});


</script>
<template>

  <main class="relative flex flex-col items-center min-h-screen bg-slate-900 text-gray-100 py-12 px-4 sm:px-6">

    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>

    <div class="relative z-10 flex flex-col w-full max-w-7xl space-y-12">

      <div class="flex items-center justify-start">
        <button type="button"
          class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-blue-500 transition-colors shadow-md"
          @click="$router.push({ name: 'home' })">
          Tagasi
        </button>
      </div>

      <section class="flex flex-col items-center justify-center text-center mt-4 mb-8">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          {{ theatre.name }}
        </h1>
        <div class="h-1 w-20 bg-blue-500 rounded-full mt-6 shadow-md shadow-blue-500/50"></div>
      </section>

      <ShowtimesGrid :showtimes="showtimesList" />

    </div>
  </main>

</template>
