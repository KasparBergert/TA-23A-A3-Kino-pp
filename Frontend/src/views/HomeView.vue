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
      "Some description Some description Some description Some description Some description Some description Some description Some description Some description Some description v v Some description"
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


</script>

<template>
  <Toaster></Toaster>
  <TheNavbar></TheNavbar>
  <main class="main">
    <div class="content">
      <div style="display: flex; justify-content: center; align-items: center;">
        <div class="showtime-box">
          <div class="showtime-dropdown">
            <button class="btn-primary bold showtime-dropdown-btn">
              {{ selectedTheatre && selectedTheatre.id != null ? selectedTheatre.name : "Vali kino" }}
              <span style="font-size:18px;">&#8595;</span>
            </button>

            <ul>
              <li v-for="theatre in theatres" :key="theatre.id || -1">
                <button @click="selectedTheatre = theatre" class="showtime-dropdown-selection">
                  {{ theatre.name }}
                </button>
              </li>
            </ul>
          </div>

          <button class="view-showtimes-btn btn-primary outlined"
            @click="onShowtimesClicked">
            Vaata seansse
          </button>
        </div>
      </div>

      <div class="content-header">
        <h1 class="section-title">TOP 3 MOVIES</h1>
        <section class="movie-grid">
          <MovieCard v-for="movie in top3movies" :key="movie.id" :movie="movie"/>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  width: 100%;
  max-width: 80rem;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("https://images.unsplash.com/photo-1614850523011-8f49ffc73908?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000");
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
  overflow-y: visible;
  background-repeat: no-repeat;
  background-size: cover;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 80rem;
}

.section-title {
  display: flex;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #e6e6e6;
  justify-content: center;
}

.showtime-box {
  width: max-content;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 1.1em 1.9em;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1.3em;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
}

.showtime-dropdown {
  position: relative;
}

.showtime-dropdown ul {
  display: none;
  position: absolute;
  background-color: rgb(219, 219, 219);
  list-style: none;
  z-index: 1000;
  border-radius: 2em;
}


.showtime-dropdown:hover ul {
  display: block;
}

.showtime-dropdown-selection {
  text-align: left;
  user-select: none;
  cursor: pointer;
  padding: 10px 4px;
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  text-wrap: nowrap;
}

.showtime-dropdown-selection:hover {
  background-color: #e6e6e6;
}

.showtime-dropdown-btn {
  padding: 0.5rem 1.5rem !important;
}

.view-showtimes-btn {
  padding: 0.5rem 3rem !important;
}
</style>
