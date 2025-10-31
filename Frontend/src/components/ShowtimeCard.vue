<script setup lang="ts">
import type ShowtimeType from '../types/ShowtimeType'

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
</script>

<template>
  <div
    class="showtime-card flex md:flex-row gap-4 p-4 rounded-2xl bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-md">
    <!-- Poster -->
    <img :src="showtime.film.poster_url" :alt="showtime.film.title" class="w-1/3 h-48 object-cover rounded-xl" />

    <!-- Info -->
    <div class="flex flex-col justify-between flex-1">
      <div>
        <h2 class="text-xl font-semibold text-white truncate">
          {{ showtime.film.title }}
        </h2>
        <p class="text-sm text-gray-300 mt-1">
          <span class="font-medium text-gray-200">Theatre:</span> {{ showtime.theatre_name }}
        </p>
        <p class="text-sm text-gray-300">
          <span class="font-medium text-gray-200">Hall:</span> {{ showtime.hall.name }}
        </p>
        <p class="text-sm text-gray-300">
          <span class="font-medium text-gray-200">Duration:</span> {{ showtime.film.duration_min }} min
        </p>
      </div>

      <div class="border-t border-gray-700 mt-3 pt-2 text-sm text-gray-300">
        <p><span class="font-medium text-gray-200">Starts:</span> {{ formatTime(showtime.starts_at) }}</p>
        <p><span class="font-medium text-gray-200">Ends:</span> {{ formatTime(showtime.ends_at) }}</p>

        <div class="mt-3 flex flex-row items-start justify-between align-start gap-2">
          <p class="font-semibold" :class="showtime.hall.available_seats > 0 ? 'text-green-400' : 'text-red-400'">
            {{ showtime.hall.available_seats > 0 ? `${showtime.hall.available_seats} seats available` : 'Sold Out' }}
          </p>
          <button class="px-3 py-2 bg-yellow-500 rounded-md cursor-pointer text-gray-700 font-bold">Buy ticket</button>
        </div>
      </div>

    </div>
  </div>
</template>
