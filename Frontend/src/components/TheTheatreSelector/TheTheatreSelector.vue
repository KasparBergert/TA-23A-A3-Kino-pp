<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { toast } from '@steveyuowo/vue-hot-toast'
import { useRouter } from 'vue-router'
import TheDropdown from './components/TheDropdown.vue'
import { theatreService } from '../../services/TheatreService'
import { theatres } from '@prisma/client'

const fetchedTheatres = ref<theatres[]>([])
const selectedTheatre = ref<theatres | null>(null)
const router = useRouter()

function setTheatres(list: theatres[]) {
  if (list.length === 0) {throw new Error("Error occured fetching theatres")}
  fetchedTheatres.value = list
}

function onShowtimesClicked() {

  if (selectedTheatre === null) {
    toast.error('Palun vali kino.')
    return
  }

  router.push(`/showtimes?theatre_id=${selectedTheatre.value?.id}`)
}

onMounted(async () => {
  try {
    const res = await theatreService.getAllTheatres()
    setTheatres(res.theatres)
  } catch (err) {
    toast.error(err)
  }
})

</script>

<template>
  <section class="flex justify-center items-center">
    <div
      class="flex flex-wrap gap-4 justify-center items-center p-6 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">

      <TheDropdown v-model:selectedTheatre="selectedTheatre" :theatres="fetchedTheatres" />

      <button @click="onShowtimesClicked"
        class="py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
        Vaata seansse
      </button>
    </div>
  </section>
</template>
