<script setup>
import { onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'
import FormRegister from './components/FormRegister.vue'
import FormLogin from './components/FormLogin.vue'
import { useRouter } from 'vue-router'
import client from '../../utils/api'
const router = useRouter()

//should be fetched from the database, because there is
const theatres = ref([])
const selectedTheatre = ref("Pole Valitud")
const dialogController = ref(null)

function onItemClick(theatre) {
  selectedTheatre.value = theatre
}

onMounted(async () => {
  // fetch movies

  // fetch theatres
  const result = await client.get('/services/theatres', );
  console.log()
  theatres.value = result.data.theatres
})

function viewShowtimes() {
  // e.g. router.push(...) or emit event
  router.push('/showtimes')
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
</template>

<style scoped>
</style>
