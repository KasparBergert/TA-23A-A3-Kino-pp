<script setup lang="ts">
import type ShowtimeDTO from '../../../../shared/types/ShowtimeDTO';
import ShowtimeCard from './components/ShowtimeCard.vue';
defineProps<{
  showtimes: ShowtimeDTO[]
}>();
</script>
<template>

  <section v-if="showtimes.length === 0" class="flex justify-center items-center">
    <p class="text-2xl">Kahjuks pole sellel kinos ühtegi seanssi saadaval.</p>
  </section>

  <section v-else class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
    <ShowtimeCard v-for="showtime in showtimes" :key="showtime.id" :showtime="showtime" />
  </section>

</template>
