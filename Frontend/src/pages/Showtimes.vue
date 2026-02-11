<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showtimeService } from '../entities/ShowtimeService';
import { theatreService } from '../entities/TheatreService';
import { genreService } from '../entities/GenreService';
import type { theatre, genre } from '@prisma/client';
import type ShowtimeDTO from '../../../shared/types/ShowtimeDTO';
import ShowtimesGrid from '../features/showtimes/ShowtimesGrid.vue';
import TheatresDTO from '../../../shared/types/TheatreDTO';

const route = useRoute();
const theatreId = ref<number>(Number(route.query.theatreId));
if (Number.isNaN(theatreId.value)) {
  theatreId.value = 0;
}

const theatre = ref<theatre>({ name: '...', id: 0 });
const showtimesList = ref<ShowtimeDTO[]>([]);
const genres = ref<genre[]>([]);
const selectedDate = ref<string>('');
const selectedGenreId = ref<number | ''>('');
const isLoading = ref(false);

async function loadTheatreDetails() {
  if (!theatreId.value) return;
  const theatreRes: TheatresDTO = await theatreService.getDetails(theatreId.value);
  theatre.value = theatreRes;
}

async function loadGenres() {
  genres.value = await genreService.getAll();
}

async function loadShowtimes() {
  isLoading.value = true;
  const filters: Record<string, string | number> = {};
  if (theatreId.value) filters.theatreId = theatreId.value;
  if (selectedDate.value) filters.date = selectedDate.value;
  if (selectedGenreId.value) filters.genreId = Number(selectedGenreId.value);

  const showtimesRes: ShowtimeDTO[] = await showtimeService.get(filters);
  showtimesList.value = showtimesRes;
  isLoading.value = false;
}

watch([selectedDate, selectedGenreId], loadShowtimes);

onMounted(async () => {
  await Promise.all([loadTheatreDetails(), loadGenres()]);
  await loadShowtimes();
});
</script>

<template>
  <main class="relative flex flex-col items-center min-h-screen bg-slate-900 text-gray-100 py-12 px-4 sm:px-6">
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>

    <div class="relative z-10 flex flex-col w-full max-w-7xl space-y-10">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-blue-500 transition-colors shadow-md"
          @click="$router.push({ name: 'home' })"
        >
          Back
        </button>

        <div class="flex gap-3 items-center flex-wrap">
          <label class="text-sm text-slate-300">
            Date
            <input v-model="selectedDate" type="date" class="ml-2 rounded bg-slate-800 border border-slate-700 px-2 py-1 text-slate-100" />
          </label>
          <label class="text-sm text-slate-300">
            Genre
            <select v-model="selectedGenreId" class="ml-2 rounded bg-slate-800 border border-slate-700 px-2 py-1 text-slate-100">
              <option value="">All</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </label>
        </div>
      </div>

      <section class="flex flex-col items-center justify-center text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          {{ theatre.name }}
        </h1>
        <div class="h-1 w-20 bg-blue-500 rounded-full mt-4 shadow-md shadow-blue-500/50"></div>
      </section>

      <div v-if="isLoading" class="text-center text-slate-300 py-10">Loading showtimes...</div>
      <ShowtimesGrid v-else :showtimes="showtimesList" />
    </div>
  </main>
</template>
