<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@steveyuowo/vue-hot-toast'
import orderStore from '../store/OrderStore'
import { bookingService } from '../entities/BookingService'
import BackgroundGlow from '../widgets/BackgroundGlow.vue'
import authStore from '../store/AuthStore'

const router = useRouter()

const email = ref('')
const saveToAccount = ref(true)
const submitting = ref(false)
const holdEndsAt = ref<number | null>(orderStore.getHoldExpiresAt())
const now = ref(Date.now())
let tick: number | undefined

const showtime = orderStore.getShowtime()
const seats = orderStore.getChosenSeats()

const timeLeft = computed(() => {
  if (!holdEndsAt.value) return 0
  return Math.max(0, holdEndsAt.value - now.value)
})

const isExpired = computed(() => timeLeft.value <= 0)

const seatCount = computed(() => seats.length)
const seatLabels = computed(() =>
  seats.map((s) => `${s.row} · #${s.id}`)
)
const accountEmail = computed(() => authStore.user.value?.email ?? '')
const selectedEmail = computed(() => (saveToAccount.value && accountEmail.value ? accountEmail.value : email.value))

onMounted(() => {
  if (!showtime || seatCount.value === 0) {
    router.replace('/')
    return
  }
  tick = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (tick) window.clearInterval(tick)
})

async function submitReservation() {
  if (!showtime) return
  if (isExpired.value) {
    toast.error('Broneering aegus, alusta uuesti')
    router.replace('/')
    return
  }
  const cleanEmail = selectedEmail.value.trim()
  if (!cleanEmail) {
    toast.error('Sisesta e-post')
    return
  }
  submitting.value = true
  try {
    const res = await bookingService.reserve({
      showtimeId: showtime.id,
      seatIds: seats.map((s) => s.id),
      email: cleanEmail,
    })
    toast.success('Broneering kinnitatud! Kontrolli e-posti.')
    console.log('reservation', res)
    orderStore.setOrderId(res.orderId)
    orderStore.clear({ preserveOrderId: true })
    router.replace({ name: 'showtimes', query: { theatreId: showtime.theatre.id, date: showtime.startsAt.split('T')[0] } })
  } catch (err: any) {
    toast.error(err?.message ?? 'Broneerimine ebaõnnestus')
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6">
    <BackgroundGlow />

    <div class="relative z-10 w-full max-w-md">
      <form autocomplete="off" @submit.prevent="submitReservation"
        class="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-5">
        <button type="button" class="text-sm text-slate-400 hover:text-white" @click="router.back()">
          ← Tagasi istekohtade valikusse
        </button>

        <h2 class="text-xl font-semibold text-gray-100">
          Kinnita broneering
        </h2>

        <div class="text-sm text-slate-300 space-y-1">
          <p>{{ showtime?.film.title }} · {{ showtime?.theatre.name }}</p>
          <p>{{ showtime ? new Date(showtime.startsAt).toLocaleString('et-EE', { dateStyle: 'medium', timeStyle: 'short' }) : '' }}</p>
          <p>Kohad: {{ seatCount }}</p>
          <p v-if="seatLabels.length" class="text-xs text-slate-400">Valitud: {{ seatLabels.join(', ') }}</p>
          <p v-if="holdEndsAt">Aeg jäänud: {{ Math.floor(timeLeft / 60000).toString().padStart(2, '0') }}:{{ Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0') }}</p>
        </div>

        <div>
          <label class="block text-sm mb-1 text-gray-300">
            E-posti aadress (kinnituseks)
          </label>
          <input
            v-model="email"
            :disabled="saveToAccount && accountEmail"
            type="email"
            placeholder="nimi@e-post.ee"
            autocomplete="off"
            required
            class="py-2.5 px-3 block w-full rounded-lg bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" />
        </div>

        <div v-if="authStore.isAuthenticated.value" class="flex items-center gap-2 text-sm text-slate-200">
          <input id="saveAccount" type="checkbox" v-model="saveToAccount" class="h-4 w-4 text-indigo-600 bg-slate-800 border-slate-700 rounded" />
          <label for="saveAccount">Salvesta broneering minu kontole ({{ accountEmail || '—' }})</label>
        </div>

        <p class="text-xs text-slate-400">
          Pole kaardimakset: broneering salvestatakse ja saadame kinnituse e-postiga. Kohad hoitakse kuni 15 minutit.
        </p>

        <button type="submit" :disabled="submitting || isExpired"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed">
          {{ isExpired ? 'Aegunud' : (submitting ? 'Kinnitan...' : 'Kinnita ja salvesta') }}
        </button>
      </form>
    </div>
  </main>
</template>
