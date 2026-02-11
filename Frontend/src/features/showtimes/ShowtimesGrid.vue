<script setup lang="ts">
import ShowtimeDTO from '../../../../shared/types/ShowtimeDTO';
import ShowtimeCard from './ShowtimeCard/ShowtimeCard.vue';
defineProps<{
  showtimes: ShowtimeDTO[]
}>();
</script>
<template>
  <section v-if="showtimes.length === 0" class="flex justify-center items-center py-20">
    <p class="text-xl md:text-2xl text-slate-400">
      😢 Kahjuks pole sellel kuupäeval seansse.
    </p>
  </section>

  <section v-else class="flex flex-col gap-4 p-2">
    <ShowtimeCard v-for="showtime in showtimes" :key="showtime.id" :showtime="showtime" />
  </section>
</template>
