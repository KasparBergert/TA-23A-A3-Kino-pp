<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TheNavbar from '../components/TheNavbar.vue'
import MovieGrid from '../features/movies/MovieGrid.vue'
import client from '../utils/api'
import m from '../assets/movies.json' with {type: 'json'}

const theatres = ref<string[]>([])
const selectedTheatre = ref('Pole Valitud')


onMounted(async () => {
  const result = await client.get('/services/theatres')
  theatres.value = result.data.theatres
})
</script>

<template>
  <TheNavbar></TheNavbar>
  <main class="main">
    <div class="content">
      <div class="content-header">
        <h1 class="section-title">Now Showing</h1>
      </div>
      <MovieGrid :movies="m"/>
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

</style>

