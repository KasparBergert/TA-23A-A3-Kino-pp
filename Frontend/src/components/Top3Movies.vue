<script setup lang="ts">
import { onMounted, ref } from 'vue'

export interface Movie {
  id: number
  title: string
  genres?: string[]
  poster?: string
  summary: string
}

onMounted(() => {
  //get top 3 movies
  //fetch them, endpoint not yet implemented
  /*
  try {
    const result = await client.get('/services/movies/top3')
    top3movies.value = result.data.movies
  } catch {
    toast.error("Fatal error occured fetching top movies");
  }
  */
})

//currently hardcoded top 3 movies
const top3movies = ref<Movie[]>(
  [
    {
      id: 1,
      title: 'The Dark Knight',
      genres: ['Action', 'Crime', 'Drama'],
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      summary:
        "Some description"
    },
    {
      id: 2,
      title: 'Inception',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      summary:
        "Some description Some description Some description Some description Some description Some description Some description Some description Some description Some description v v Some description  v Some description  v Some description "
    },
    {
      id: 3,
      title: 'Interstellar',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      summary:
        "Some description"
    },
  ]
)
</script>

<template>
  <section class="text-center">
    <h1
      class="text-3xl sm:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
      TOP 3 MOVIES
    </h1>

    <div class="grid gap-8 sm:gap-10 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] w-full max-w-6xl mx-auto">
      <div v-for="movie in top3movies" :key="movie.id"
        class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <img :src="movie.poster" :alt="movie.title"
          class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="p-5 text-left">
          <h2 class="text-lg font-semibold text-gray-100 mb-1 group-hover:text-indigo-400 transition-colors">
            {{ movie.title }}
          </h2>
          <p class="text-gray-400 text-sm mb-3 line-clamp-3">{{ movie.summary }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="g in movie.genres" :key="g"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-gray-300 border border-slate-600">
              {{ g }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
