<script setup lang="ts">
import { onMounted, ref } from "vue";
import { filmsService } from "../entities/FilmService";
import type { films } from "@prisma/client";
import HeroFilms from "../features/film/HeroFilms.vue";
import FilmsGrid from "../features/film/FilmsGrid.vue";
import TheTheatreSelector from "../features/theatre/TheTheatreSelector.vue";
import TheNavbar from "../widgets/TheNavbar.vue";
import BackgroundGlow from "../widgets/BackgroundGlow.vue";

const films = ref<films[]>([]);
const top3films = ref<films[]>([]);

onMounted(async () => {
  try {
    const films_fetched = await filmsService.getAll();
    films.value = films_fetched;
    top3films.value = films.value.slice(0, 3);
  } catch (err) {
    console.error("Error fetching films:", err);
  }
});

</script>
<template>
  <TheNavbar />
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6">
    <BackgroundGlow />
    <div class="relative z-10 flex flex-col gap-20 w-full max-w-7xl">
      <TheTheatreSelector />
      <HeroFilms :top3films="top3films" />
      <FilmsGrid :films="films" />
    </div>
  </main>
</template>
