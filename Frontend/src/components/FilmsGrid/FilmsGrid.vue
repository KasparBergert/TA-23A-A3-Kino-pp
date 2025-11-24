<script setup lang="ts">
import { films } from '@prisma/client';
import FilmsGridCard from './FilmsGridCard.vue';

const props = defineProps<{
  films: films[]
}>()

</script>
<template>
  <div
    class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start">
      <FilmsGridCard v-for="film in films" :key="film.id" :film="film" />
  </div>
</template>
