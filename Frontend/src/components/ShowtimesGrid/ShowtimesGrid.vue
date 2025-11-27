<script setup lang="ts">
import type ShowtimeDTO from '../../../../shared/types/ShowtimeDTO';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  showtimes: ShowtimeDTO[]
}>();

function handleShowtimeClick(showtime_id: number) {
  router.push({ name: 'seat-select', query: { showtime_id: showtime_id.toString() } });
}

</script>
<template>

  <section v-if="showtimes.length === 0" class="flex justify-center items-center">
    <p class="text-2xl">Kahjuks pole sellel kinos ühtegi seanssi saadaval.</p>
  </section>

  <section v-else class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
    <div v-for="showtime in showtimes" :key="showtime.id" class="bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex relative z-2 cursor-pointer
hover:shadow-2xl hover:scale-[1.03] transition-all duration-[450ms]" @click="handleShowtimeClick(showtime.id)">
      <img :src="showtime.film.poster_url ?? ''"
        class="w-28 overflow-hidden relative z-0 h-full object-cover inset-0 rounded-l-xl" />

      <div class="flex flex-col ml-4 py-6 pr-6">
        <h2 class="text-xl font-semibold">{{ showtime.film.title }}</h2>
        <p>Aeg: {{ new Date(showtime.starts_at).toLocaleString() }}</p>
        <p>Saali number: {{ showtime.hall.name }}</p>
      </div>
    </div>
  </section>

</template>
