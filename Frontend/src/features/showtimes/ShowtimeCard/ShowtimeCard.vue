<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import orderStore from '../../../store/OrderStore'
import ShowtimeDTO from '../../../../../shared/types/ShowtimeDTO'

const props = defineProps<{
  showtime: ShowtimeDTO
}>()

const router = useRouter()

function handleBooking() {
  orderStore.setShowtime(props.showtime)
  router.push({ name: 'seat-select', query: { hallId: props.showtime.hall.id } })
}
</script>
<template>
  <div
    class="bg-slate-800 border border-slate-700 rounded-xl shadow-xl flex relative z-2 group hover:bg-slate-700/60 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-900/70 transition-all duration-300 ease-in-out"
  >
    <RouterLink :to="`/films/${showtime.film.id}`" class="flex flex-1">
      <div class="w-32 flex-shrink-0 overflow-hidden relative rounded-l-xl">
        <img
          :src="showtime.film.posterUrl ?? ''"
          class="w-full h-full object-cover"
          :alt="`Plakat filmile: ${showtime.film.title}`"
        />
      </div>

      <div class="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h2 class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-2">
            {{ showtime.film.title }}
          </h2>
        </div>

        <div class="space-y-1">
          <p class="text-base text-slate-300">
            <span class="font-semibold text-blue-400">Aeg:</span>
            {{ new Date(showtime.startsAt).toLocaleString('et-EE', { dateStyle: 'long', timeStyle: 'short' }) }}
          </p>

          <p class="text-sm text-slate-400">
            <span class="font-semibold text-slate-300">Saal:</span>
            {{ showtime.hall.name }}
          </p>
        </div>
      </div>
    </RouterLink>
    <div class="flex items-center pr-4">
      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-500 transition-colors"
        @click.stop="handleBooking"
      >
        Broneeri
      </button>
    </div>
  </div>
</template>
