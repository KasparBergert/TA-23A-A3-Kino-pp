<script setup lang="ts">

import { computed, reactive, ref } from 'vue'
import type ShowtimeType from '../types/ShowtimeType'
import { DatabaseSync } from 'node:sqlite'

const props = defineProps({
  showtime: {
    type: Object as () => ShowtimeType,
    required: true
  }
})

// Helper for time formatting
const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  })


const movie = reactive(
  {
    ends_at: "2025-11-01T18:00:00.000Z",
    film: {
      id: 1,
      title: 'The Dark Knight',
      duration_min: 120,
      poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
    },
    hall: {
      name: 'Hall A',
      total_seats: 150,
      available_seats: 110
    },
    starts_at: "2025-11-01T16:00:00.000Z",
    theatre_id: 1,
    theatre_name: "Downtown Cinema",
  },
)

const available_percent = computed(() => {
  return ((movie.hall.available_seats) / movie.hall.total_seats) * 100;
});

console.log(available_percent.value);

const showtime_time = {
  date: computed(() => new Date(movie.starts_at).toLocaleString(undefined, { day: '2-digit', month: 'short', })),
  starts: computed(() => new Date(movie.starts_at).toLocaleString(undefined, { hour: "2-digit", minute: '2-digit' })),
  ends: computed(() => new Date(movie.ends_at).toLocaleString(undefined, { hour: "2-digit", minute: '2-digit' })),
}

</script>

<template>

  <div
    class="bg-slate-700 py-10 text-white flex flex-col justify-center items-center rounded-2xl gap-5 ring-1 ring-slate-600 my-4 px-3 shadow-lg">
    <h1 class="font-bold text-3xl">{{ movie.film.title }}</h1>
    <img :src="movie.film.poster_url" alt="Movie Poster" class="w-80 rounded-3xl
      shadow-blue-400/20 shadow-lg
    " />
    <div class="text-left text-lg w-full max-w-md">
      <div class="flex flex-col justify-center items-center max-w-md ">
        <div class="grid grid-cols-1 gap-2 bg-slate-800/50 p-6 rounded-2xl min-w-full ">
          <p>
            <span class="font-semibold">Theatre:</span> {{ movie.theatre_name }}
          </p>
          <p>
            <span class="font-semibold">Time: {{ showtime_time.date }}</span>
            <br></br>
            Starts: {{ showtime_time.starts }}
            <br></br>
            Ends: {{ showtime_time.ends }}
          </p>
          <p>
            <span class="font-semibold">Available Seats:</span> {{ movie.hall.available_seats }}

          <div class="w-full bg-green-600 h-1">
            <div class="transform duration-900 bg-emerald-900 h-1" :style="{ width: available_percent + '%' }"></div>
          </div>
          </p>
        </div>
        <button
          class="w-full mt-5 px-5 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-600 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer">
          Buy Tickets
        </button>
      </div>

    </div>
  </div>
</template>
