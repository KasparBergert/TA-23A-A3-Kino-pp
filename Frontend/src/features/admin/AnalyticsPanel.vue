<script setup lang="ts">
import type { AnalyticsOverview } from '../../entities/AnalyticsService'

defineProps<{
  analytics: AnalyticsOverview | null
}>()
</script>

<template>
  <section class="bg-slate-800 rounded-xl p-6 shadow space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Analytics</h2>
      <p class="text-sm text-slate-400" v-if="analytics">Updated</p>
    </div>

    <div v-if="!analytics" class="text-slate-400 text-sm">Loading analytics...</div>
    <div v-else class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600/20 text-blue-200 border border-blue-500/50 rounded-lg px-4 py-3">
          <p class="text-xs uppercase tracking-wide">Total bookings</p>
          <p class="text-2xl font-semibold">{{ analytics.totalBookings }}</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 class="font-semibold mb-2 text-slate-200">Bookings per movie</h3>
          <ul class="space-y-1 max-h-48 overflow-y-auto">
            <li v-for="movie in analytics.bookingsPerMovie" :key="movie.filmId" class="flex justify-between text-sm">
              <span class="text-slate-300">{{ movie.filmTitle }}</span>
              <span class="text-slate-200 font-semibold">{{ movie.bookings }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h3 class="font-semibold mb-2 text-slate-200">Occupancy</h3>
          <ul class="space-y-1 max-h-48 overflow-y-auto">
            <li v-for="row in analytics.occupancy" :key="row.showtimeId" class="flex justify-between text-sm">
              <div>
                <p class="text-slate-200">{{ row.filmTitle }}</p>
                <p class="text-slate-400 text-xs">{{ row.hallName }}</p>
              </div>
              <div class="text-right">
                <p class="text-slate-200 font-semibold">{{ row.occupancyPercent }}%</p>
                <p class="text-slate-400 text-xs">{{ row.availableSeats }} open / {{ row.totalSeats }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
