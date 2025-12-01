<script setup lang="ts">
import { films } from '@prisma/client';
import FilmsGridCard from './FilmsGrid/FilmsGridCard.vue';

const props = defineProps<{
  films: films[]
}>()


</script>
<template>
  <p class="text-5xl font-bold">Veel Filme</p>
  <div class="grid gap-6 sm:gap-8 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] w-full max-w-7xl mx-auto">
    <FilmsGridCard v-for="film in props.films" :key="film.id" :film="film" />
  </div>
</template>
