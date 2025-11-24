<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import TheNavbar from "../components/TheNavbar.vue";
import BackgroundGlow from "../components/BackgroundGlow.vue";
import TheTheatreSelector from "../components/TheTheatreSelector/TheTheatreSelector.vue";
import HeroFilms from "../components/HeroFilms/HeroFilms.vue";
import FilmsGrid from "../components/FilmsGrid/FilmsGrid.vue";
import valueValidator from "../utils/RequestValidator";
import filmsService from "../services/FilmsService";
import type { films } from "@prisma/client";

const films = ref<films[]>([]);
const top3films = ref<films[]>([]);

async function setFilms(films_fetched: films[]) {
  valueValidator.validate(films_fetched);
  films.value = films_fetched;
}

onMounted(async () => {
  try{
  const films_fetched = await filmsService.getAllFilms();
  await setFilms(films_fetched.films);
  //get 3 top films
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
