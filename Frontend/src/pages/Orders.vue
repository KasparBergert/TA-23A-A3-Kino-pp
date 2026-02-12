<script setup lang="ts">
import TheNavbar from '../widgets/TheNavbar.vue'
import orderStore from '../store/OrderStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderId = computed(() => orderStore.getOrderId())
const seats = computed(() => orderStore.getChosenSeats())
const showtime = computed(() => orderStore.getShowtime())

function goShowtimes() {
  router.push({ name: 'showtimes', query: { theatreId: 0 } })
}
</script>

<template>
  <TheNavbar />
  <main class="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 flex justify-center">
    <div class="w-full max-w-3xl space-y-6">
      <h1 class="text-3xl font-bold">Minu broneeringud</h1>

      <div v-if="!orderId" class="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
        <p>Aktivset broneeringut pole.</p>
        <button class="mt-3 px-4 py-2 bg-blue-600 rounded text-white" @click="goShowtimes">Mine seanssidele</button>
      </div>

      <div v-else class="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <p class="text-sm text-slate-400">Tellimus</p>
        <p class="text-xl font-semibold">#{{ orderId }}</p>
        <p v-if="showtime">Film: {{ showtime.film.title }} · {{ showtime.theatre.name }} · {{ showtime.hall.name }}</p>
        <p>Kohad: {{ seats.length || '—' }}</p>
        <button class="mt-3 px-4 py-2 bg-blue-600 rounded text-white" @click="goShowtimes">Vaata kava</button>
      </div>
    </div>
  </main>
</template>
