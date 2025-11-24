<script setup lang="ts">
import type { films } from '@prisma/client';
import { watchEffect } from 'vue';

const props = defineProps<{
  film: films
}>()

watchEffect(() => {
  console.log("Films updated in Card:", props.film);
});

</script>
<template>
  <div class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start">
    <!-- Poster -->
    <div class="relative w-full aspect-[2/3] overflow-hidden">
      <img :src="film.poster_url ?? ''" :alt="film.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>

    <!-- Film Info -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Title -->
      <h2 class="text-xl font-semibold mb-2 text-gray-100">
        {{ film.title }}
      </h2>
    </div>
    <!-- Additional info can go here -->
  </div>

</template>
