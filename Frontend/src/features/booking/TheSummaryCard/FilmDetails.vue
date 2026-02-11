<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type FilmDTO from '../../../../../shared/types/FilmDTO';
import orderStore from '../../../store/OrderStore';
import useSafeBack from '../../../utils/useSafeBack';
import ShowtimeDTO from '../../../../../shared/types/ShowtimeDTO';

const props = defineProps<{
  film: FilmDTO
}>();

const { safeBack } = useSafeBack();

const showtime = ref<ShowtimeDTO | null>(null)

onMounted(() => {
  const st = orderStore.getShowtime()

  if (st === null) {
    console.error('FilmDetails: showtime received was null')
    safeBack('/')
    return
  }

  showtime.value = st
})


</script>
<template>
  <div>
    <h2 class="text-xl md:text-2xl font-bold tracking-tight">{{ film.title }}</h2>
    <p class="text-sm text-slate-400 mt-2 font-medium">{{ showtime?.hall.name }}</p>
    <div class="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
      <span class="bg-slate-700/50 px-2 py-1 rounded">Duration: {{ film.durationMin }} minutes</span>
    </div>
  </div>
</template>
