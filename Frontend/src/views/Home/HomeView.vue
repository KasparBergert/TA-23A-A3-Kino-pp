<script setup>
import { onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'
import FormRegister from './components/FormRegister.vue'
import FormLogin from './components/FormLogin.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const theatres = ref(['Tallinn - Mustamäe', 'Tallinn - Solaris', 'Tartu - Näpuots'])
const selectedTheatre = ref(theatres.value[0])
const dialogController = ref(null)

function onItemClick(theatre) {
  selectedTheatre.value = theatre
}

onMounted(() => {
  // fetch movies etc.
})

function viewShowtimes() {
  // e.g. router.push(...) or emit event
  console.log('viewShowtimes')
}

function showFilm(movie_id) {
  console.log('showFilm', movie_id)
}

function showModal(rawComp) {
  dialogController.value.setView(rawComp)
  dialogController.value.open()
}

function onLogin(){
  console.log("login invoked")
}
</script>

<template>
  <Dialog ref="dialogController" />
  <v-app>  <!-- Vuetify root wrapper -->
    <v-app-bar app elevated>
      <v-toolbar>
        <v-btn text @click="showModal(FormLogin)">Login</v-btn>
        <v-btn text @click="showModal(FormRegister)">Register</v-btn>
      </v-toolbar>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height d-flex flex-column align-center justify-center">
        <v-card>
          <v-card-actions>
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props">
                  {{ selectedTheatre }}
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="theatre in theatres"
                  :key="theatre"
                  @click="onItemClick(theatre)"
                >
                  <v-list-item-title>{{ theatre }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn color="primary" class="ml-4" @click="viewShowtimes">
              View Showtimes
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Insert movie list or other content -->
      </v-container>
    </v-main>
  </v-app>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Now Showing</h1>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition"
      >
        <img
          :src="movie.image"
          :alt="movie.title"
          class="rounded-t-lg w-full h-56 object-cover"
        />
        <div class="p-4">
          <h2 class="text-lg font-semibold">{{ movie.title }}</h2>
          <p class="text-gray-600 text-sm">{{ movie.genre }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Movie {
  id: number
  title: string
  genre: string
  image: string
}

const movies = ref<Movie[]>([])

onMounted(async () => {
  const res = await fetch('/src/assets/movies.json')
  movies.value = await res.json()
})
</script>

<style scoped>
/* optional basic dark theme vibes */
body {
  background-color: #f4f5f7;
}
</style>
