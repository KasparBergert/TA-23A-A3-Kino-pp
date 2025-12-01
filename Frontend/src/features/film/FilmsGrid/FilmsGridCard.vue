<script setup lang="ts">
import type { films } from '@prisma/client'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  film: films
}>()
</script>

<template>
  <RouterLink
    :to="`/films/${film.id}`"
    class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start block"
  >
    <!-- Poster -->
    <div class="relative w-full aspect-[2/3] overflow-hidden">
      <img
        :src="film.poster_url ?? ''"
        :alt="film.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <!-- Film Info -->
    <div class="p-4 flex flex-col flex-grow">
      <h2 class="text-xl font-semibold mb-2 text-gray-100">
        {{ film.title }}
      </h2>
    </div>
  </RouterLink>
</template>
