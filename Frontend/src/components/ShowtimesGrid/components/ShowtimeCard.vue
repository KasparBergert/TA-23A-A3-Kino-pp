<script setup lang="ts">
import { useRouter } from 'vue-router';
import orderStore from '../../../store/OrderStore';
import ShowtimeDTO from '../../../../../shared/types/ShowtimeDTO';
import showtimeService from '../../../services/ShowtimeService';

const props = defineProps<{
  showtime: ShowtimeDTO
}>();

const router = useRouter();

function handleShowtimeClick(hall_id: number) {
  orderStore.setShowtime(props.showtime);
  router.push({ name: 'seat-select', query: { hall_id: hall_id.toString() } });
}
</script>
<template>
  <div class="bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex relative z-2 cursor-pointer
hover:shadow-2xl hover:scale-[1.03] transition-all duration-[450ms]" @click="handleShowtimeClick(showtime.hall.id)">
    <img :src="showtime.film.poster_url ?? ''"
      class="w-28 overflow-hidden relative z-0 h-full object-cover inset-0 rounded-l-xl" />

    <div class="flex flex-col ml-4 py-6 pr-6">
      <h2 class="text-xl font-semibold">{{ showtime.film.title }}</h2>
      <p>Aeg: {{ new Date(showtime.starts_at).toLocaleString() }}</p>
      <p>Saali number: {{ showtime.hall.name }}</p>
    </div>
  </div>
</template>
