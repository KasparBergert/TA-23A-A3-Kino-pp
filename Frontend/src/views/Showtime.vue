<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { ref } from "vue";
import ShowtimeCard from "../components/ShowtimeCard.vue";
import Showtime from "../types/ShowtimeType.ts";
import client from "../utils/api";
import BackgroundGlow from "../components/BackgroundGlow.vue";

import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => router.push('/');

const route = useRoute();
const showtimes = ref<Showtime[]>([]);

onMounted(async () => {
  try {
    //get the showtimes
    const response = await client.post("/services/showtimes", {
      film_id: null,
      theatre_id: Number(route.params.theatre_id),
    });
    showtimes.value = response.data.showtimes;
    console.log(response.data.showtimes);
  } catch (err) {
    console.error(err);
  }
});
</script>
<template>
  <main
    class="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-full w-full min-h-screen flex items-center justify-center overflow-hidden relative"
  >
    <BackgroundGlow />
    <div class="flex w-max h-max gap-5">
      <ShowtimeCard
        v-for="(showtime, index) in showtimes"
        :key="index"
        :showtime="showtime"
      />
    </div>
    <button
  @click="goHome"
  class="absolute top-5 left-5 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl shadow"
>
  ← Tagasi esilehele
</button>
  </main>
</template>
