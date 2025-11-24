<script setup>
import { onMounted, ref } from 'vue'
import { toast } from '@steveyuowo/vue-hot-toast'
import { useRouter } from 'vue-router'
import TheDropdown from './components/TheDropdown.vue'
import valueValidator from '../../utils/RequestValidator'
import theatreService from '../../services/TheatreService'

const theatres = ref([])
const selectedTheatre = ref(null)
const router = useRouter()

async function fetchTheatres() {
  try {
    const res = await theatreService.getAllTheatres()
    setTheatres(res.theatres)
  } catch (err) {
    handleError()
  }
}

function setTheatres(list) {
  valueValidator.validate(list)
  theatres.value = list
}

function handleError() {
  toast.error('Fatal error occurred fetching theatres')
}

function onShowtimesClicked() {
  const id = selectedTheatre.value?.id

  if (!id) {
    toast.error('Palun vali kino.')
    return
  }

  router.push(`/showtimes/${id}`)
}

onMounted(fetchTheatres)
</script>

<template>
  <section class="flex justify-center items-center">
    <div
      class="flex flex-wrap gap-4 justify-center items-center p-6 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">

      <TheDropdown
      v-model:selectedTheatre="selectedTheatre"
      :theatres="theatres" />

      <button @click="onShowtimesClicked"
        class="py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
        Vaata seansse
      </button>
    </div>
  </section>
</template>
