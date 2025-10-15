<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheNavbar from '../components/TheNavbar.vue'
import MovieGrid from '../features/movies/MovieGrid.vue'
import Theatre from '../../../shared/models/Theatre'
import client from '../utils/api'
import m from '../assets/movies.json' with {type: 'json'}
import { RouterLink } from 'vue-router'



const theatres = ref<Array<Theatre>>([]);
const selectedTheatre = ref<Theatre | null>(null)

onMounted(async () => {
  const result = await client.get('/services/theatres')
  if (result.data.theatres.length === 0) {
    theatres.value = [{ id: null, name: "kinode saamine ebaõnnestus" }] // hold error when fetching failed
  } else {
    theatres.value = result.data.theatres
  }
})

</script>

<template>
  <TheNavbar></TheNavbar>
  <main class="main">
    <div class="content">
      <div class="showtime-box">
        <div class="showtime-dropdown">
          <button class="btn-primary bold showtime-dropdown-btn">
            {{ selectedTheatre && selectedTheatre.id != null ? selectedTheatre.name : "Vali kino" }}
            <span style="font-size:18px;">&#8595;</span>
          </button>

          <ul>
            <li v-for="theatre in theatres" :key="theatre.id">
              <button @click="
                selectedTheatre = theatre              
              " class="showtime-dropdown-selection">
                {{ theatre.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- RouterLink uses selectedTheatre.id dynamically -->
        <RouterLink class="view-showtimes-btn btn-primary outlined"
          :to="selectedTheatre ? `/showtimes/${selectedTheatre.id}` : '#'">
          Vaata seansse
        </RouterLink>
      </div>

      <div class="content-header">
        <h1 class="section-title">Now Showing</h1>
        <MovieGrid :movies="m" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
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
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.showtime-box {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
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
