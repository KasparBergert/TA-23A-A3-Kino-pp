<script setup lang="ts">

import { computed, reactive } from 'vue'
import type ShowtimeType from '../types/ShowtimeType'

const { showtime } = defineProps({
  showtime: {
    type: Object as () => ShowtimeType,
    required: true
  }
})

const available_percent = computed(() => {
  return ((showtime.hall.available_seats) / showtime.hall.total_seats) * 100;
});

const showtime_time = {
  date: computed(() => new Date(showtime.starts_at).toLocaleString(undefined, { day: '2-digit', month: 'short', })),
  starts: computed(() => new Date(showtime.starts_at).toLocaleString(undefined, { hour: "2-digit", minute: '2-digit' })),
  ends: computed(() => new Date(showtime.ends_at).toLocaleString(undefined, { hour: "2-digit", minute: '2-digit' })),
}

</script>

<template>
  <div class="bg-slate-700 py-10 text-white flex flex-col items-center justify-center
           rounded-2xl gap-5 ring-1 ring-slate-600 my-4 px-3 shadow-lg">
    <!-- Film Title -->
    <h1 class="text-3xl font-bold">
      {{ showtime.film.title }}
    </h1>

    <!-- Poster -->
    <img :src="showtime.film.poster_url" alt="Showtime Poster" class="w-80 rounded-3xl shadow-lg shadow-blue-400/20" />

    <!-- Showtime Info -->
    <div class="w-full max-w-md text-left text-lg">
      <div class="flex flex-col items-center justify-center max-w-md">
        <div class="grid gap-2 bg-slate-800/50 p-6 rounded-2xl w-full">
          <p>
            <span class="font-semibold">Theatre:</span>
            {{ showtime.theatre_name }}
          </p>

          <p>
            <span class="font-semibold">Time:</span> {{ showtime_time.date }}<br />
            Starts: {{ showtime_time.starts }}<br />
            Ends: {{ showtime_time.ends }}
          </p>

          <p>
            <span class="font-semibold">Available Seats:</span>
            {{ showtime.hall.available_seats }}
          </p>

          <!-- Availability Bar -->
          <div class="w-full bg-green-600 h-1 rounded-full overflow-hidden">
            <div class="h-1 bg-emerald-900 transition-all duration-700 ease-in-out"
              :style="{ width: available_percent + '%' }"></div>
          </div>
        </div>

        <!-- Buy Button -->
        <button class="w-full mt-5 px-5 py-3 rounded-lg font-semibold text-white
                 bg-gradient-to-r from-yellow-500 to-yellow-600
                 hover:from-yellow-600 hover:to-yellow-700
                 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          Buy Tickets
        </button>
      </div>
    </div>
  </div>
</template>
