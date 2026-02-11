<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filmsService } from '../entities/FilmService'
import type { film } from '@prisma/client'
import type ActorDTO from '../../../shared/types/ActorDTO'
import TheNavbar from '../widgets/TheNavbar.vue'
import BackgroundGlow from '../widgets/BackgroundGlow.vue'
import { actorService } from '../entities/ActorsService'
import { theatreService } from '../entities/TheatreService'
import { showtimeService } from '../entities/ShowtimeService'
import type ShowtimeDTO from '../../../shared/types/ShowtimeDTO'
import type TheatresDTO from '../../../shared/types/TheatreDTO'

const route = useRoute()
const router = useRouter()
const film = ref<film | null>(null)
const actors = ref<ActorDTO[]>([])
const theatres = ref<TheatresDTO[]>([])
const selectedTheatreId = ref<number | null>(null)
const localToday = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}
const selectedDate = ref<string>(localToday())
const showtimes = ref<ShowtimeDTO[]>([])
const loadingShowtimes = ref(false)

const releaseLabel = computed(() =>
  film.value?.releaseDate ? new Date(film.value.releaseDate).toLocaleDateString() : 'N/A',
)
const durationLabel = computed(() => (film.value?.durationMin ? `${film.value.durationMin} min` : 'N/A'))
const topCast = computed(() =>
  actors.value.slice(0, 4).map((a) => a.name).join(', ')
)

onMounted(async () => {
  const filmId = Number(route.params.id)

  try {
    if (Number.isNaN(filmId)) throw new Error('FilmId is not a number')

    const film_fetched = await filmsService.getById(filmId)
    const actors_fetched = await actorService.getByFilmId(filmId)
    theatres.value = await theatreService.getAll()
    await loadShowtimes()

    if (!film_fetched || !film_fetched.film) throw new Error('Failed to fetch films');

    film.value = film_fetched.film
    actors.value = Array.isArray(actors_fetched) ? actors_fetched : []
  } catch (err) {
    console.error(err)
    router.replace('/')
  }
})

async function loadShowtimes() {
  loadingShowtimes.value = true
  try {
    const filters: Record<string, string | number> = {
      filmId: Number(route.params.id),
      date: selectedDate.value,
    }
    if (selectedTheatreId.value) filters.theatreId = selectedTheatreId.value
    const res = await showtimeService.get(filters)
    showtimes.value = res ?? []
  } catch (err) {
    console.error('Failed to load showtimes', err)
    showtimes.value = []
  } finally {
    loadingShowtimes.value = false
  }
}
</script>

<template>
  <TheNavbar />
<main
  class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-100 py-12 px-4 sm:px-8">
  <BackgroundGlow />

  <section v-if="film" class="relative z-10 w-full max-w-6xl space-y-10">
    <!-- Hero card -->
    <div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-indigo-900/40 backdrop-blur">
      <div class="grid lg:grid-cols-[1fr,1.25fr] gap-0">
        <div class="relative flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div class="absolute inset-0 opacity-30 blur-3xl scale-125"
               :style="`background-image:url(${film.posterUrl});background-size:cover;background-position:center;`"></div>
          <div
            class="relative w-full max-w-xs sm:max-w-sm aspect-[2/3] overflow-hidden rounded-2xl shadow-xl shadow-indigo-900/50 m-6 border border-slate-800">
            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-transparent mix-blend-screen"></div>
            <img :src="film.posterUrl ?? ''" :alt="film.title" class="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <div class="p-8 md:p-10 lg:p-12 space-y-6">
          <div class="flex items-center gap-3">
            <span
              class="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center text-indigo-100 font-semibold">★</span>
            <p class="text-xs uppercase tracking-[0.35em] text-indigo-200/80">Kinodes</p>
          </div>

          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow">
            {{ film.title }}
          </h1>

          <p class="text-slate-200 leading-relaxed text-lg">
            {{ film.description }}
          </p>

          <div class="flex flex-wrap gap-2 text-xs font-semibold">
            <span class="chip">Režissöör: {{ film.director ?? 'Puudub' }}</span>
            <span class="chip">Kestus: {{ durationLabel }}</span>
            <span class="chip">Reiting: {{ film.rating ?? 'PG-13' }}</span>
            <span class="chip">Keel: {{ film.language ?? 'EN' }}</span>
            <span class="chip">Esilinastus: {{ releaseLabel }}</span>
          </div>

          <div class="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              class="ghost"
              @click="router.back()">
              Tagasi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Trailer & details -->
    <div class="grid lg:grid-cols-2 gap-6">
      <div class="glass p-5 space-y-3">
        <h2 class="section-title">Treiler</h2>
        <div v-if="film.trailerUrl" class="aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
          <iframe :src="film.trailerUrl" class="w-full h-full" allowfullscreen allow="autoplay; encrypted-media"></iframe>
        </div>
        <p v-else class="text-slate-300 text-sm">Trailer coming soon.</p>
      </div>

      <div class="glass p-5 space-y-3">
        <h2 class="section-title">Detailid</h2>
        <dl class="space-y-2 text-sm text-slate-200">
          <div class="detail-row"><dt>Režissöör</dt><dd>{{ film.director ?? 'Puudub' }}</dd></div>
          <div class="detail-row"><dt>Kestus</dt><dd>{{ durationLabel }}</dd></div>
          <div class="detail-row"><dt>Reiting</dt><dd>{{ film.rating ?? 'PG-13' }}</dd></div>
          <div class="detail-row"><dt>Keel</dt><dd>{{ film.language ?? 'EN' }}</dd></div>
          <div class="detail-row"><dt>Esilinastus</dt><dd>{{ releaseLabel }}</dd></div>
          <div class="detail-row"><dt>Osatäitjad</dt><dd>{{ topCast || 'Varsti lisandub' }}</dd></div>
        </dl>
      </div>
    </div>

    <!-- Cast -->
    <div class="glass p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="section-title">Näitlejad</h2>
        <span class="text-xs text-slate-400">{{ actors.length }} liiget</span>
      </div>
      <ul v-if="actors.length" class="space-y-2">
        <li v-for="actor in actors" :key="actor.id" class="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2">
          <span class="text-sm font-semibold text-white">{{ actor.name }}</span>
          <a v-if="actor.link" :href="actor.link" target="_blank" rel="noreferrer"
            class="text-xs text-indigo-300 hover:text-indigo-200">
            IMDb
          </a>
        </li>
      </ul>
      <p v-else class="text-slate-300">Cast not available.</p>
    </div>

    <!-- Showtimes -->
    <div class="glass p-5 space-y-4">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-xs text-slate-400">Cinema</label>
          <select v-model.number="selectedTheatreId" class="input">
            <option :value="null">All cinemas</option>
            <option v-for="t in theatres" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-slate-400">Date</label>
          <input v-model="selectedDate" type="date" class="input" />
        </div>
        <div class="flex gap-2">
          <button class="cta" type="button" @click="loadShowtimes">Show all showtimes</button>
        </div>
      </div>

      <div v-if="loadingShowtimes" class="text-slate-300 text-sm">Loading showtimes…</div>
      <div v-else-if="!showtimes.length" class="text-slate-300 text-sm">No showtimes for this date.</div>
      <ul v-else class="space-y-3">
        <li v-for="st in showtimes" :key="st.id" class="flex justify-between items-center bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
          <div>
            <p class="text-white font-semibold">{{ new Date(st.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
            <p class="text-xs text-slate-400">{{ st.theatre.name }} · {{ st.hall.name }} · {{ st.format?.toUpperCase?.() || '2D' }}</p>
          </div>
          <span class="chip">Rating {{ st.rating ?? 'PG' }}</span>
        </li>
      </ul>
    </div>
  </section>

  <section v-else class="relative z-10 w-full max-w-3xl text-center text-slate-300">
    <p>Loading film details...</p>
  </section>
</main>
</template>

<style scoped>
.chip {
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: #111827;
  border: 1px solid #1f2937;
  color: #e5e7eb;
}
.cta {
  padding: 0.75rem 1.4rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  color: white;
  font-weight: 700;
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.25);
}
.cta:hover { filter: brightness(1.05); }
.ghost {
  padding: 0.75rem 1.4rem;
  border-radius: 0.75rem;
  border: 1px solid #334155;
  color: #e2e8f0;
  background: transparent;
}
.input {
  min-width: 180px;
  padding: 0.55rem 0.75rem;
  border-radius: 0.65rem;
  border: 1px solid #1f2937;
  background: #0b1529;
  color: #e2e8f0;
}
.glass {
  border: 1px solid #1f2937;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 1.2rem;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
}
.section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #e5e7eb;
}
.detail-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 0.75rem;
  align-items: baseline;
}
.detail-row dt { color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
.detail-row dd { color: #e2e8f0; }
</style>
