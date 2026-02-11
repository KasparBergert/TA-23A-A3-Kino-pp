<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { filmsService } from "../entities/FilmService";
import type { film } from "@prisma/client";
import HeroFilms from "../features/film/HeroFilms.vue";
import FilmsGrid from "../features/film/FilmsGrid.vue";
import TheTheatreSelector from "../features/theatre/TheTheatreSelector.vue";
import TheNavbar from "../widgets/TheNavbar.vue";
import BackgroundGlow from "../widgets/BackgroundGlow.vue";

const films = ref<film[]>([]);
const top3films = ref<film[]>([]);
const search = ref("");

onMounted(async () => {
  try {
    const films_fetched = await filmsService.getAll();
    films.value = films_fetched ?? [];
  } catch (err) {
    console.error("Error fetching films:", err);
  }
});

const filteredFilms = computed(() =>
  films.value.filter(
    (f) =>
      f.title.toLowerCase().includes(search.value.toLowerCase()) ||
      (f.description ?? "").toLowerCase().includes(search.value.toLowerCase())
  )
);

watch(
  filteredFilms,
  (list) => {
    top3films.value = list.slice(0, 3);
  },
  { immediate: true }
);

</script>
<template>
  <TheNavbar />
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6">
    <BackgroundGlow />
    <div class="relative z-10 flex flex-col gap-20 w-full max-w-7xl">
      <TheTheatreSelector />
      <div class="flex justify-end">
        <input v-model="search" placeholder="Search movies" class="w-full md:w-1/2 input" />
      </div>
      <HeroFilms :top3films="top3films" />
      <FilmsGrid :films="filteredFilms" />
    </div>
  </main>
</template>

<style scoped>
.input {
  border-radius: 0.5rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 0.5rem 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}
</style>
