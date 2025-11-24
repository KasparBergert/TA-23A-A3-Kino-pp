<script setup lang="ts">
import { ref } from 'vue';
import type { films } from '@prisma/client';

const props = defineProps<{
  film: films
}>()

const isExapnded = ref(false);

function toggleExpand() {
  isExapnded.value = !isExapnded.value;
}

</script>
<template>

  <div
    class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start">

    <!-- Poster -->
    <div class="relative w-full aspect-[2/3] overflow-hidden">
      <img :src="film.poster_url ?? ''" :alt="film.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>

    <!-- Content -->
    <div class="p-5 text-left flex flex-col flex-grow">
      <h2 class="text-lg font-semibold text-gray-100 mb-2 group-hover:text-indigo-400 transition-colors">
        {{ film.title }}
      </h2>

      <!-- Summary (clamped if not expanded) -->
      <p class="text-gray-400 text-sm mb-3"
        :class="{ 'line-clamp-3': film.description !== null ? film.description.length > 120 : !isExapnded }">
        {{ film.description }}
      </p>

      <button v-if="film.description!.length > 120" type="button"
        class="text-indigo-400 text-xs font-medium hover:underline mb-3 self-start" @click="toggleExpand()">
        {{ isExapnded ? 'Show Less' : 'Read More' }}
      </button>

      <!-- Genres
          <div class="mt-auto flex flex-wrap gap-2">
            <span v-for="g in film.genres" :key="g"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-gray-300 border border-slate-600">
              {{ g }}
            </span>
          </div>
          -->
    </div>
  </div>
</template>
<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
