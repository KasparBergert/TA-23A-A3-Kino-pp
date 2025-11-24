<script setup lang="ts">
import type { films } from '@prisma/client';

const props = defineProps<{
  film: films
}>()

</script>
<template>

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
</template>
