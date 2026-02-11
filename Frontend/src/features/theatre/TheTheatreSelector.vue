<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { toast } from '@steveyuowo/vue-hot-toast'
import { useRouter } from 'vue-router'
import TheDropdown from './TheTheatreSelector/TheDropdown.vue'
import { theatreService } from '../../entities/TheatreService'
import { theatre } from '@prisma/client'

const fetchedTheatres = ref<theatre[]>([])
const selectedTheatre = ref<theatre | null>(null)
const search = ref('')
const cityFilter = ref('all')
const sortBy = ref<'name' | 'city'>('name')
const router = useRouter()

function setTheatres(list: theatre[]) {
  if (list.length === 0) { throw new Error("Error occured fetching theatres") }
  fetchedTheatres.value = list
}

const cities = computed(() => ['all', ...new Set(fetchedTheatres.value.map((t) => t.city).filter(Boolean))])

const filteredTheatres = computed(() => {
  const term = search.value.toLowerCase()
  return fetchedTheatres.value
    .filter((t) => (cityFilter.value === 'all' ? true : t.city === cityFilter.value))
    .filter((t) => t.name.toLowerCase().includes(term) || t.city.toLowerCase().includes(term))
    .sort((a, b) => a[sortBy.value].localeCompare(b[sortBy.value]))
})

function onShowtimesClicked() {
  if (selectedTheatre.value === null) {
    toast.error('Palun vali kino.')
    return;
  }

  router.push(`/showtimes?theatreId=${selectedTheatre.value?.id}`)
}

onMounted(async () => {
  try {
    const theatre = await theatreService.getAll()
    setTheatres(theatre)
  } catch (err) {
    toast.error(err)
  }
})

</script>

<template>
  <section class="flex justify-center items-center">
    <div
      class="flex flex-wrap gap-4 justify-center items-center p-6 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">

      <div class="flex flex-col gap-2">
        <input v-model="search" placeholder="Search cinema or city" class="input" />
        <div class="flex gap-2">
          <select v-model="cityFilter" class="input">
            <option v-for="city in cities" :key="city" :value="city">{{ city === 'all' ? 'All cities' : city }}</option>
          </select>
          <select v-model="sortBy" class="input">
            <option value="name">Sort by name</option>
            <option value="city">Sort by city</option>
          </select>
        </div>
      </div>

      <TheDropdown v-model:selectedTheatre="selectedTheatre" :theatres="filteredTheatres" />

      <button @click="onShowtimesClicked"
        class="py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
        Vaata seansse
      </button>
    </div>
  </section>
</template>

<style scoped>
.input {
  border-radius: 0.5rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 0.5rem 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}
</style>
