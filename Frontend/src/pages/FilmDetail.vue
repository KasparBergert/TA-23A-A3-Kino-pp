<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filmsService } from '../entities/FilmsService'
import type { films } from '@prisma/client'
import TheNavbar from '../widgets/TheNavbar.vue'
import BackgroundGlow from '../widgets/BackgroundGlow.vue'

const route = useRoute()
const router = useRouter()
const film = ref<films | null>(null)

const releaseLabel = computed(() =>
  film.value?.release_date ? new Date(film.value.release_date).toLocaleDateString() : 'N/A',
)
const durationLabel = computed(() => (film.value?.duration_min ? `${film.value.duration_min} min` : 'N/A'))

onMounted(async () => {
  const idParam = route.params.id
  const filmId = Number(idParam)
  if (Number.isNaN(filmId)) {
    router.replace('/')
    return
  }

  try {
    const res = await filmsService.getAllFilms()
    const found = res?.films?.find((f: films) => f.id === filmId) ?? null
    if (!found) {
      router.replace('/')
      return
    }
    film.value = found
  } catch (err) {
    console.error('Error loading film detail', err)
    router.replace('/')
  }
})
</script>

<template>
  <TheNavbar />
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-100 py-12 px-4 sm:px-8"
  >
    <BackgroundGlow />

    <section v-if="film" class="relative z-10 w-full max-w-6xl">
      <div
        class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-blue-900/30 backdrop-blur"
      >
        <div class="grid lg:grid-cols-[1fr,1.2fr] gap-0">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent mix-blend-screen"></div>
            <img
              :src="film.poster_url ?? ''"
              :alt="film.title"
              class="w-full h-full object-cover min-h-[400px]"
            />
          </div>

          <div class="p-8 md:p-10 lg:p-12 space-y-6">
            <div class="flex items-center gap-3">
              <span class="h-10 w-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-semibold">★</span>
              <p class="text-xs uppercase tracking-[0.35em] text-blue-200/80">Featured film</p>
            </div>

            <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow">
              {{ film.title }}
            </h1>

            <p class="text-slate-200 leading-relaxed text-lg">
              {{ film.description }}
            </p>

            <div class="flex flex-wrap gap-3 text-sm">
              <span class="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">
                Released: {{ releaseLabel }}
              </span>
              <span class="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200">
                Duration: {{ durationLabel }}
              </span>
            </div>

            <div class="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                class="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors"
                @click="router.push({ name: 'home' })"
              >
                Vaata seansse
              </button>
              <button
                type="button"
                class="px-5 py-3 rounded-xl border border-slate-700 text-slate-200 hover:border-blue-400 hover:text-blue-200 transition-colors"
                @click="router.back()"
              >
                Tagasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="relative z-10 w-full max-w-3xl text-center text-slate-300">
      <p>Loading film details...</p>
    </section>
  </main>
</template>
