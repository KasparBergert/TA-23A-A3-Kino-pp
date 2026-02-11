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

const uniqueFilms = computed(() => {
  const seen = new Set<string>();
  return films.value.filter((f) => {
    const key = f.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
});

const filteredFilms = computed(() =>
  uniqueFilms.value.filter(
    (f) =>
      f.title.toLowerCase().includes(search.value.toLowerCase()) ||
      (f.description ?? "").toLowerCase().includes(search.value.toLowerCase())
  )
);

const searchSuggestions = computed(() =>
  uniqueFilms.value
    .filter((f) => f.title.toLowerCase().includes(search.value.toLowerCase()))
    .slice(0, 6)
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
  <TheNavbar :show-search="true" v-model:search="search" :suggestions="searchSuggestions" />
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6">
    <BackgroundGlow />
    <div class="relative z-10 flex flex-col gap-20 w-full max-w-7xl">
      <TheTheatreSelector />
      <HeroFilms :top3films="top3films" />
      <FilmsGrid :films="filteredFilms" />
    </div>
  </main>
</template>
