<script setup lang="ts">
import type FilmDTO from '../../../../../shared/types/FilmDTO';


defineProps<{
  film: FilmDTO
}>();

</script>
<template>
  <div>
    <h2 class="text-xl md:text-2xl font-bold tracking-tight">{{ film.title }}</h2>
    <p class="text-sm text-slate-400 mt-2 font-medium">Tallinn, Saal 1</p>
    <div class="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
      <span class="bg-slate-700/50 px-2 py-1 rounded">2h 15m</span>
      <span class="bg-slate-700/50 px-2 py-1 rounded">PG-13</span>
    </div>
  </div>
</template>
