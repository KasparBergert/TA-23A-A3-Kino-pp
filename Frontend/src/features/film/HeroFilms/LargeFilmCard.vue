<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { film } from '@prisma/client'

const props = defineProps<{
  film: film
}>()

const isExapnded = ref(false)

function toggleExpand(event: MouseEvent) {
  event.preventDefault()
  isExapnded.value = !isExapnded.value
}
</script>

<template>
  <RouterLink
    :to="`/films/${film.id}`"
    class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start block"
  >
    <div class="relative w-full aspect-[2/3] overflow-hidden">
      <img
        :src="film.posterUrl ?? ''"
        :alt="film.title"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div class="p-5 text-left flex flex-col flex-grow">
      <h2 class="text-lg font-semibold text-gray-100 mb-2 group-hover:text-indigo-400 transition-colors">
        {{ film.title }}
      </h2>

      <p
        class="text-gray-400 text-sm mb-3"
        :class="{ 'line-clamp-3': film.description !== null ? film.description.length > 120 : !isExapnded }"
      >
        {{ film.description }}
      </p>

      <button
        v-if="film.description && film.description.length > 120"
        type="button"
        class="text-indigo-400 text-xs font-medium hover:underline mb-3 self-start"
        @click="toggleExpand"
      >
        {{ isExapnded ? 'Show Less' : 'Read More' }}
      </button>
    </div>
  </RouterLink>
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
