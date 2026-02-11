<script setup lang="ts">
import type { theatre } from '@prisma/client'

defineProps<{ theatres: theatre[], selectedTheatre: theatre | null }>()
const emit = defineEmits<{
  (e: 'update:selectedTheatre', value: theatre): void
}>()


</script>
<template>
  <div class="hs-dropdown relative inline-flex">
    <button id="hs-dropdown-theatre" type="button"
      class="hs-dropdown-toggle py-2.5 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-slate-600 bg-slate-700 text-gray-100 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      {{ selectedTheatre?.name || "Vali kino" }}
      <svg class="w-4 h-4 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      class="hs-dropdown-menu hidden z-10 mt-2 w-56 bg-slate-700 text-gray-100 shadow-xl rounded-lg p-2 space-y-1 border border-slate-600"
      aria-labelledby="hs-dropdown-theatre">
      <button v-for="theatre in theatres" :key="theatre.id" @click="emit('update:selectedTheatre', theatre)"
        class="w-full text-left px-4 py-2 rounded-md hover:bg-slate-600 text-sm transition-colors">
        <div class="font-semibold">{{ theatre.name }}</div>
        <div class="text-xs text-slate-300">{{ theatre.city }}</div>
      </button>
    </div>
  </div>
</template>
