<script setup lang="ts">
import type ShowtimeDTO from '../../../../shared/types/ShowtimeDTO';
import ShowtimeCard from './components/ShowtimeCard.vue';
defineProps<{
  showtimes: ShowtimeDTO[]
}>();
</script>
<template>
  <section v-if="showtimes.length === 0" class="flex justify-center items-center py-20">
    <p class="text-xl md:text-2xl text-slate-400">
      😢 Kahjuks pole sellel kinos ühtegi seanssi saadaval.
    </p>
  </section>

  <section v-else class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] p-2">
    <ShowtimeCard v-for="showtime in showtimes" :key="showtime.id" :showtime="showtime" />
  </section>
</template>
