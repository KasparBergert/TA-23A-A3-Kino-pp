<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheNavbar from '../components/TheNavbar.vue'
import Theatre from '../../../shared/models/Theatre'
import client from '../utils/api'
import { Toaster, toast } from '@steveyuowo/vue-hot-toast'
import { useRouter } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'

export interface Movie {
  id: number
  title: string
  genres?: string[]
  poster?: string
  summary: string
}

const router = useRouter();

const theatres = ref<Array<Theatre>>([]);
const selectedTheatre = ref<Theatre | null>(null)

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

onMounted(async () => {

  //get all available theatres
  try {
    const result = await client.get('/services/theatres')
    if (result.data.theatres.length === 0) {
      theatres.value = [{ id: null, name: "kinode saamine ebaõnnestus" }] // hold error when fetching failed
      console.log(result.data)
      console.log("database has no theatres")
    } else {
      theatres.value = result.data.theatres
    }
  } catch {
    toast.error("Fatal error occured fetching theatres");
  }


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

function onShowtimesClicked(){
  if (selectedTheatre != null && selectedTheatre.value?.id != null){
    router.push(`/showtimes/${selectedTheatre.value?.id}`)
  } else {
    toast.error("Palun vali kino.");
  }
}

const genres = ref([
  { name: 'Comedy', color: 'from-yellow-400 to-orange-500' },
  { name: 'Action', color: 'from-red-500 to-rose-600' },
  { name: 'Thriller', color: 'from-purple-500 to-indigo-600' },
  { name: 'Animation', color: 'from-blue-400 to-teal-500' },
]);

</script>
<template>
  <Toaster />
  <TheNavbar />

  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6"
  >
    <!-- Subtle animated background gradient glow -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
    </div>

    <div class="relative z-10 flex flex-col gap-20 w-full max-w-7xl">

      <!-- Showtime Selection -->
      <div class="flex justify-center items-center">
        <div class="flex flex-wrap gap-4 justify-center items-center p-6 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">

          <!-- Preline Dropdown -->
          <div class="hs-dropdown relative inline-flex">
            <button
              id="hs-dropdown-theatre"
              type="button"
              class="hs-dropdown-toggle py-2.5 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-slate-600 bg-slate-700 text-gray-100 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {{ selectedTheatre && selectedTheatre.id != null ? selectedTheatre.name : "Vali kino" }}
              <svg class="w-4 h-4 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              class="hs-dropdown-menu hidden z-10 mt-2 w-56 bg-slate-700 text-gray-100 shadow-xl rounded-lg p-2 space-y-1 border border-slate-600"
              aria-labelledby="hs-dropdown-theatre"
            >
              <button
                v-for="theatre in theatres"
                :key="theatre.id || -1"
                @click="selectedTheatre = theatre"
                class="w-full text-left px-4 py-2 rounded-md hover:bg-slate-600 text-sm transition-colors"
              >
                {{ theatre.name }}
              </button>
            </div>
          </div>

          <!-- View Showtimes Button -->
          <button
            @click="onShowtimesClicked"
            class="py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Vaata seansse
          </button>
        </div>
      </div>

      <!-- Top 3 Movies -->
      <div class="text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          TOP 3 MOVIES
        </h1>

        <section class="grid gap-8 sm:gap-10 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] w-full max-w-6xl mx-auto">
          <div
            v-for="movie in top3movies"
            :key="movie.id"
            class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <img
              :src="movie.poster"
              :alt="movie.title"
              class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="p-5 text-left">
              <h2 class="text-lg font-semibold text-gray-100 mb-1 group-hover:text-indigo-400 transition-colors">
                {{ movie.title }}
              </h2>
              <p class="text-gray-400 text-sm mb-3 line-clamp-3">
                {{ movie.summary }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="g in movie.genres"
                  :key="g"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-gray-300 border border-slate-600"
                >
                  {{ g }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Genre Section -->
      <div class="text-center mt-10">
        <h2 class="text-2xl font-bold mb-8 text-gray-100">Browse by Genre</h2>
        <div class="grid gap-6 sm:gap-8 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] max-w-5xl mx-auto">
          <div
            v-for="genre in genres"
            :key="genre.name"
            class="cursor-pointer bg-gradient-to-br p-6 rounded-2xl text-white font-semibold text-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            :class="genre.color"
          >

            {{ genre.name }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
