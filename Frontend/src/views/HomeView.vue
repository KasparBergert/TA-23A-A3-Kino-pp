<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Modal from '../components/Modal.vue'
import TheNavbar from '../components/TheNavbar.vue'
import MovieGrid from '../components/MovieGrid.vue'
import { useRouter } from 'vue-router'
import client from '../utils/api'
import m from '../assets/movies.json' with {type: 'json'}


const router = useRouter()

const theatres = ref<string[]>([])
const selectedTheatre = ref('Pole Valitud')
const modalController = ref<InstanceType<typeof Modal> | null>(null)




function onItemClick(theatre: string) {
  selectedTheatre.value = theatre
}

function viewShowtimes() {
  router.push('/showtimes')
}

function showFilm(movie_id: number) {
  console.log('showFilm', movie_id)
}

function showModal(rawComp: any) {
  modalController.value.setComponent(rawComp)
  modalController.value.open()
}

function onLogin() {
  console.log('login invoked')
}

onMounted(async () => {
  const result = await client.get('/services/theatres')
  theatres.value = result.data.theatres
})
</script>

<template>
  <Modal ref="modalController" />

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


/* Main content */
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

/* Movie cards */

</style>

