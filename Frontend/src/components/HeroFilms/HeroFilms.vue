<script setup lang="ts">
import { ref } from 'vue'
import type { films } from '@prisma/client'
import LargeFilmCard from './components/LargeFilmCard.vue';

//currently hardcoded top 3 films
const props = defineProps<{
  top3films: films[]
}>()

</script>

<template>
  <section class="text-center p-4">
    <h1
      class="text-3xl sm:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
      TOP 3 FILMID
    </h1>
    <div
      class="grid gap-8 sm:gap-10 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] w-full max-w-6xl mx-auto min-h-[400px]"
      style="grid-auto-rows: 1fr;">
      <LargeFilmCard v-for="film in top3films" :key="film.id" :film="film" />
    </div>
  </section>
</template>
