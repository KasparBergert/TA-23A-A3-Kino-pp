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
        "Gothami linnas seisab Batman silmitsi oma seni suurima vastasega –  Jokeriga, kes külvab kaost ja seab proovile nii Batmani moraali kui ka linna õigussüsteemi. Võitlus Jokeriga paneb ohtu Batmani liitlased ja sunnib teda tegema raskeid valikuid, mis määravad tema kangelasliku identiteedi tuleviku."
    },
    {
      id: 2,
      title: 'Inception',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      summary:
        "Dom Cobb on varas, kes suudab siseneda inimeste unedesse ja varastada seal peidetud saladusi. Talle pakutakse võimalust puhastada oma kriminaalne minevik, kui ta suudab täita keeruka ülesande – mitte varastada ideed, vaid istutada see kellegi alateadvusesse. Missioon nõuab täpset meeskonnatööd ning viib nad mitmetesse unetasanditesse, kus reaalsus ja illusioonid põimuvad."
    },
    {
      id: 3,
      title: 'Interstellar',
      genres: ['Adventure', 'Drama', 'Sci-Fi'],
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      summary:
        "Lähitulevikus on Maa ökokriisis, mis seab ohtu inimkonna ellujäämise. Endine piloot Cooper liitub teadlaste meeskonnaga, et reisida läbi ussiaugu uutesse galaktikatesse otsima planeeti, kuhu inimkond saaks ümber asuda. Teekond paneb proovile meeskonna füüsilised ja emotsionaalsed piirid ning toob esile aja ja armastuse siduva jõu."
    },
  ]
)
const expandedId = ref<number | null>(null)

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

</script>

<template>
  <section class="text-center p-4">
    <h1
      class="text-3xl sm:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
      TOP 3 FILMID
    </h1>

    <div
  class="grid gap-8 sm:gap-10 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] w-full max-w-6xl mx-auto min-h-[400px]"
  style="grid-auto-rows: 1fr;"
>
      <div
  v-for="movie in top3movies"
  :key="movie.id"
  class="group bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl self-start"
>

        <!-- Poster -->
        <div class="relative w-full aspect-[2/3] overflow-hidden">
          <img :src="movie.poster" :alt="movie.title"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>

        <!-- Content -->
        <div class="p-5 text-left flex flex-col flex-grow">
          <h2 class="text-lg font-semibold text-gray-100 mb-2 group-hover:text-indigo-400 transition-colors">
            {{ movie.title }}
          </h2>

          <!-- Summary (clamped if not expanded) -->
          <p class="text-gray-400 text-sm mb-3" :class="{
            'line-clamp-3': movie.summary.length > 120 && expandedId !== movie.id
          }">
            {{ movie.summary }}
          </p>

          <button v-if="movie.summary.length > 120" type="button"
            class="text-indigo-400 text-xs font-medium hover:underline mb-3 self-start" @click="toggleExpand(movie.id)">
            {{ expandedId === movie.id ? 'Show Less' : 'Read More' }}
          </button>

          <!-- Genres -->
          <div class="mt-auto flex flex-wrap gap-2">
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


<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
