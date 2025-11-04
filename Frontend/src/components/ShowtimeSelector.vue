<script setup>
import { onMounted, ref } from 'vue'
import { toast } from '@steveyuowo/vue-hot-toast'
import { useRouter } from 'vue-router'
import client from '../utils/api'

const theatres = ref([])
const router = useRouter();

onMounted(async () => {
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

})

const selectedTheatre = ref(null)
function onShowtimesClicked() {
  if (selectedTheatre != null && selectedTheatre.value?.id != null) {
    router.push(`/showtimes/${selectedTheatre.value?.id}`)
  } else {
    toast.error("Palun vali kino.");
  }
}
</script>
<template>
  <section class="flex justify-center items-center">
    <div
      class="flex flex-wrap gap-4 justify-center items-center p-6 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">
      <div class="hs-dropdown relative inline-flex">
        <button id="hs-dropdown-theatre" type="button"
          class="hs-dropdown-toggle py-2.5 px-6 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-slate-600 bg-slate-700 text-gray-100 shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {{ selectedTheatre?.name || "Vali kino" }}
          <svg class="w-4 h-4 hs-dropdown-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          class="hs-dropdown-menu hidden z-10 mt-2 w-56 bg-slate-700 text-gray-100 shadow-xl rounded-lg p-2 space-y-1 border border-slate-600"
          aria-labelledby="hs-dropdown-theatre">
          <button v-for="theatre in theatres" :key="theatre.id" @click="selectedTheatre = theatre"
            class="w-full text-left px-4 py-2 rounded-md hover:bg-slate-600 text-sm transition-colors">
            {{ theatre.name }}
          </button>
        </div>
      </div>

      <button @click="onShowtimesClicked"
        class="py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
        Vaata seansse
      </button>
    </div>
  </section>
</template>
