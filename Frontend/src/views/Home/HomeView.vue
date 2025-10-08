<script setup>
import { onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'

const theatres = ref(['Tallinn - Mustamäe', 'Tallinn - Solaris', 'Tartu - Näpuots'])
const selectedTheatre = ref(theatres.value[0])
const dialogController = ref(null)

const showDialog = ref(false)
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
</script>

<template>
  <Dialog ref="dialogController" />
  <q-layout view="hHh lpr fFf">
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

        <div class="q-gutter-md">
          <q-btn label="login" color="primary" @click="dialogController.open()" />
          <q-btn label="register" color="primary" @click="dialogController.open()" />
        </div>

        Insert here
        <!-- movie list -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>
