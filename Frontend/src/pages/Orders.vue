<script setup lang="ts">
import TheNavbar from '../widgets/TheNavbar.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { orderService } from '../entities/OrderService'
import type OrderSummary from '../../../shared/types/OrderSummary'
import { toast } from '@steveyuowo/vue-hot-toast'

const router = useRouter()
const orders = ref<OrderSummary[]>([])
const loading = ref(false)
const paying = ref<string | null>(null)

async function fetchOrders() {
  loading.value = true
  try {
    orders.value = await orderService.getMine()
  } catch (err) {
    console.error(err)
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

function goShowtimes() {
  router.push({ name: 'showtimes', query: { theatreId: 0 } })
}

async function pay(orderId: string) {
  paying.value = orderId
  try {
    await orderService.pay(orderId)
    toast.success('Makse kinnitatud')
    await fetchOrders()
  } catch (err: any) {
    toast.error(err?.message ?? 'Makse ebaõnnestus')
    console.error(err)
  } finally {
    paying.value = null
  }
}
</script>

<template>
  <TheNavbar />
  <main class="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 flex justify-center">
    <div class="w-full max-w-4xl space-y-6">
      <h1 class="text-3xl font-bold">Minu broneeringud</h1>

      <div v-if="loading" class="bg-slate-900/70 border border-slate-800 rounded-xl p-6">Laen...</div>

      <div v-else-if="!orders.length" class="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
        <p>Aktivset broneeringut pole.</p>
        <button class="mt-3 px-4 py-2 bg-blue-600 rounded text-white" @click="goShowtimes">Mine seanssidele</button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-slate-900/70 border border-slate-800 rounded-xl p-4 md:p-5 flex flex-col gap-2"
        >
          <div class="flex justify-between items-center">
            <div class="text-sm text-slate-400">Tellimus #{{ order.id }}</div>
            <div class="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 capitalize">
              {{ order.status }}
            </div>
          </div>
          <div class="text-lg font-semibold">
            <RouterLink v-if="order.film" :to="`/films/${order.film.id}`" class="hover:text-blue-300">
              {{ order.film.title }}
            </RouterLink>
            <span v-else>Film eemaldatud</span>
          </div>
          <div class="text-sm text-slate-300 flex flex-col gap-1">
            <span v-if="order.startsAt">
              Aeg: {{ new Date(order.startsAt).toLocaleString('et-EE', { dateStyle: 'medium', timeStyle: 'short' }) }}
            </span>
            <span v-if="order.theatre">Kino: {{ order.theatre.name }}</span>
            <span v-if="order.hall">Saal: {{ order.hall.name }}</span>
            <span>Kohad: {{ order.seats.join(', ') }}</span>
            <span v-if="order.total !== undefined">Maksumus: {{ order.total }} €</span>
            <span>Esitatud: {{ new Date(order.createdAt).toLocaleString('et-EE', { dateStyle: 'short', timeStyle: 'short' }) }}</span>
          </div>
          <div class="flex gap-2">
            <RouterLink
              v-if="order.film"
              class="text-sm text-blue-400 hover:text-blue-300 underline"
              :to="`/films/${order.film.id}`"
            >
              Ava film
            </RouterLink>
            <button
              v-if="order.status === 'pending'"
              class="text-sm px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
              :disabled="paying === order.id"
              @click="pay(order.id)"
            >
              {{ paying === order.id ? 'Töötlen...' : 'Maksa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
