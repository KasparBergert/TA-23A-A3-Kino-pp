<script setup>
import { onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'
import FormRegister from './components/FormRegister.vue'
import FormLogin from './components/FormLogin.vue'

const theatres = ref(['Tallinn - Mustamäe', 'Tallinn - Solaris', 'Tartu - Näpuots'])
const selectedTheatre = ref(theatres.value[0])
const dialogController = ref(null)

function onItemClick(theatre) {
  selectedTheatre.value = theatre
}

onMounted(() => {
  // fetch movies or other async setup
})

function viewShowtimes() {
  // navigate to showtimes page
  console.log('viewShowtimes')
}

function showFilm(movie_id) {
  // navigate to film details
}

function showModal(raw) {
  dialogController.value.setView(raw)
  dialogController.value.open()
}

function onLogin(){
  console.log("working")
}

</script>
<template>
  <Dialog ref="dialogController" />
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn-group class="bg-accent text-white">
          <q-btn flat label="login" @click="showModal(FormLogin)" />
          <q-btn flat label="register" @click="showModal(FormRegister)" />
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md text-white fullscreen column items-center">
        <div class="q-ma-xl">
          <q-card>
            <q-card-actions>
              <q-btn-dropdown color="primary" :label="selectedTheatre">
                <q-list>
                  <q-item
                    v-for="theatre in theatres"
                    :key="theatre"
                    clickable
                    v-close-popup
                    @click="onItemClick(theatre)"
                  >
                    <q-item-section>{{ theatre }}</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn
                label="View showtimes"
                color="primary"
                class="q-ml-md"
                @click="viewShowtimes"
              />
            </q-card-actions>
          </q-card>
        </div>

        Insert here
        <!-- movie list -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.q-header {
  z-index: 100000;
}
</style>
