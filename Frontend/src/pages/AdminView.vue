<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import authStore from '../store/AuthStore'
import TheNavbar from '../widgets/TheNavbar.vue'
import { filmsService } from '../entities/FilmService'
import {
  createFilm,
  deleteFilm,
  listUsers,
  updateUserRole,
  createTheatre,
  deleteTheatre,
  deleteUser,
  createUser,
  updateFilm,
  createGenre,
  updateGenre,
  deleteGenre,
  getFilmGenres,
  autoScheduleShowtimes,
  deleteShowtime,
} from '../entities/AdminService'
import type { film, genre } from '@prisma/client'
import { theatreService } from '../entities/TheatreService'
import { analyticsService, type AnalyticsOverview } from '../entities/AnalyticsService'
import { genreService } from '../entities/GenreService'
import { showtimeService } from '../entities/ShowtimeService'
import { hallService } from '../entities/HallService'

const films = ref<film[]>([])
const users = ref<{ id: number; email: string; role: string }[]>([])
const theatres = ref<{ id: number; name: string }[]>([])
const genres = ref<genre[]>([])
const theatreFilms = ref<film[]>([])
const manageTheatreId = ref<number | null>(null)
const manageSelectionFilm = ref<number | null>(null)
const manageSelectionHall = ref<number | null>(null)
const scheduleStart = ref('')
const scheduleEnd = ref('')
const theatreShowtimes = ref<{ id: number; filmTitle: string; startsAt: string }[]>([])
const theatreHalls = ref<{ id: number; name: string }[]>([])
const isManagingTheatre = computed(() => manageTheatreId.value !== null)

const filmForm = ref({
  title: '',
  posterUrl: '',
  description: '',
  releaseDate: '',
  durationMin: null as number | null,
})
const editingFilmId = ref<number | null>(null)
const theatreName = ref('')
const targetUserId = ref<number | null>(null)
const targetRole = ref('user')
const newUser = ref({ email: '', password: '', role: 'user' })
const analytics = ref<AnalyticsOverview | null>(null)
const selectedGenreIds = ref<number[]>([])
const genreForm = ref<{ id: number | null; name: string }>({ id: null, name: '' })
const theatreCity = ref('')

const role = computed(() => authStore.user.value?.role)
const isSuper = computed(() => role.value === 'super_admin')
const isAdmin = computed(() => role.value === 'admin' || role.value === 'super_admin')

watch(manageTheatreId, async (id) => {
  manageSelectionFilm.value = null
  manageSelectionHall.value = null
  scheduleStart.value = ''
  scheduleEnd.value = ''
  if (id) {
    await loadTheatreFilms(id)
  } else {
    theatreFilms.value = []
    theatreShowtimes.value = []
    theatreHalls.value = []
  }
})
async function loadFilms() {
  const data = await filmsService.getAll()
  const seenTitles = new Set<string>()
  films.value = (data ?? []).filter((f) => {
    const key = f.title.toLowerCase()
    if (seenTitles.has(key)) return false
    seenTitles.add(key)
    return true
  })
}

async function loadTheatreFilms(theatreId: number) {
  const data = await filmsService.getByTheatre(theatreId)
  theatreFilms.value = data ?? []
  theatreShowtimes.value = (await showtimeService.get({ theatreId }))?.map((st) => ({
    id: st.id,
    filmTitle: st.film.title,
    startsAt: st.startsAt,
  })) ?? []
  theatreHalls.value = await hallService.getByTheatre(theatreId)
}

async function handleAutoSchedule() {
  if (!manageTheatreId.value || !scheduleStart.value || !scheduleEnd.value || !manageSelectionFilm.value) return
  await autoScheduleShowtimes({
    theatreId: manageTheatreId.value,
    filmIds: [manageSelectionFilm.value],
    startDate: scheduleStart.value,
    endDate: scheduleEnd.value,
    hallId: manageSelectionHall.value ?? undefined,
  })
  await loadTheatreFilms(manageTheatreId.value)
  await loadAnalytics()
}

async function loadUsers() {
  if (!isSuper.value) return
  const data = await listUsers()
  users.value = data ?? []
}

async function loadTheatres() {
  if (!isAdmin.value) return
  const data = await theatreService.getAll()
  theatres.value = data ?? []
}

async function loadGenres() {
  const data = await genreService.getAll()
  genres.value = data ?? []
}

async function loadAnalytics() {
  if (!isAdmin.value) return
  analytics.value = await analyticsService.getOverview()
}

async function handleSaveGenre() {
  if (!genreForm.value.name) return
  if (genreForm.value.id) {
    await updateGenre(genreForm.value.id, { name: genreForm.value.name })
  } else {
    await createGenre({ name: genreForm.value.name })
  }
  genreForm.value = { id: null, name: '' }
  await loadGenres()
}

function startEditGenre(g: genre) {
  genreForm.value = { id: g.id, name: g.name }
}

async function handleDeleteGenre(id: number) {
  await deleteGenre(id)
  await loadGenres()
}

async function handleCreateFilm() {
  if (editingFilmId.value) {
    await updateFilm(editingFilmId.value, { ...filmForm.value, genreIds: selectedGenreIds.value })
  } else {
    await createFilm({ ...filmForm.value, genreIds: selectedGenreIds.value })
  }
  await loadFilms()
  await loadAnalytics()
  editingFilmId.value = null
  filmForm.value = { title: '', posterUrl: '', description: '', releaseDate: '', durationMin: null }
  selectedGenreIds.value = []
}

async function handleDeleteFilm(id: number) {
  await deleteFilm(id)
  await loadFilms()
  await loadAnalytics()
  if (manageTheatreId.value) await loadTheatreFilms(manageTheatreId.value)
}

function startEditFilm(f: film) {
  editingFilmId.value = f.id
  filmForm.value = {
    title: f.title,
    posterUrl: f.posterUrl,
    description: f.description ?? '',
    releaseDate: f.releaseDate ? new Date(f.releaseDate).toISOString().split('T')[0] : '',
    durationMin: f.durationMin ?? null,
  }
  getFilmGenres(f.id).then((res) => {
    selectedGenreIds.value = res?.genreIds ?? []
  })
}

function cancelEdit() {
  editingFilmId.value = null
  filmForm.value = { title: '', posterUrl: '', description: '', releaseDate: '', durationMin: null }
  selectedGenreIds.value = []
}

async function handleUpdateRole() {
  if (!targetUserId.value) return
  await updateUserRole(targetUserId.value, targetRole.value)
  await loadUsers()
}

async function handleCreateUser() {
  if (!newUser.value.email || !newUser.value.password) return
  await createUser(newUser.value)
  newUser.value = { email: '', password: '', role: 'user' }
  await loadUsers()
}

async function handleCreateTheatre() {
  await createTheatre({ name: theatreName.value, city: theatreCity.value })
  theatreName.value = ''
  theatreCity.value = ''
  await loadTheatres()
  await loadAnalytics()
}

async function handleDeleteTheatre(id: number) {
  await deleteTheatre(id)
  if (manageTheatreId.value === id) {
    manageTheatreId.value = null
    theatreFilms.value = []
  }
  await loadTheatres()
}

async function handleAssignFilmToTheatre(filmId: number, theatreId: number | null) {
  await updateFilm(filmId, { theatreId })
  await loadFilms()
  if (theatreId) await loadTheatreFilms(theatreId)
  manageSelectionFilm.value = null
  manageSelectionHall.value = null
  scheduleStart.value = ''
  scheduleEnd.value = ''
}

async function handleDeleteShowtime(id: number, theatreId: number | null) {
  await deleteShowtime(id)
  if (theatreId) await loadTheatreFilms(theatreId)
}

async function handleDeleteUser(id: number) {
  await deleteUser(id)
  await loadUsers()
}

onMounted(async () => {
  await loadFilms()
  await loadUsers()
  await loadTheatres()
  await loadAnalytics()
  await loadGenres()
})
</script>

<template>
  <TheNavbar />
  <main class="min-h-screen bg-slate-900 text-gray-100 p-6 flex flex-col gap-8">
    <header class="flex justify-between items-center">
      <h1 class="text-3xl font-semibold">Adminpaneel</h1>
      <p class="text-sm text-gray-300">Sisse logitud: {{ authStore.user.value?.email }} ({{ authStore.user.value?.role }})</p>
    </header>

    <section class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Filmid</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <input v-model="filmForm.title" class="input" placeholder="Pealkiri" />
          <input v-model="filmForm.posterUrl" class="input" placeholder="Postri URL" />
          <input v-model="filmForm.description" class="input" placeholder="Kirjeldus" />
          <input v-model="filmForm.releaseDate" class="input" placeholder="Linastuskuupäev" />
          <input v-model.number="filmForm.durationMin" class="input" placeholder="Kestus (min)" />
          <div class="space-y-2">
            <p class="text-sm text-gray-300 font-semibold">Žanrid</p>
            <div class="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              <label
                v-for="g in genres"
                :key="g.id"
                class="flex items-center gap-2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-sm"
              >
                <input type="checkbox" :value="g.id" v-model="selectedGenreIds" />
                <span>{{ g.name }}</span>
              </label>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn" @click="handleCreateFilm">{{ editingFilmId ? 'Salvesta muudatused' : 'Lisa film' }}</button>
            <button v-if="editingFilmId" class="btn-outline" @click="cancelEdit">Tühista</button>
          </div>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div v-for="f in films" :key="f.id" class="flex justify-between items-center bg-slate-700 rounded px-3 py-2">
            <div>
              <span>{{ f.title }}</span>
              <p class="text-xs text-gray-400">Kino ID: {{ f.theatreId ?? '—' }}</p>
            </div>
            <div class="flex gap-2">
              <button class="text-blue-300 text-sm" @click="startEditFilm(f)">Muuda</button>
              <button class="text-red-300 text-sm" @click="handleDeleteFilm(f.id)">Kustuta</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isManagingTheatre" class="mt-6 grid md:grid-cols-3 gap-4 border border-slate-700 rounded-xl p-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">Filmid kinos {{ theatres.find(t => t.id === manageTheatreId)?.name }}</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="f in theatreFilms" :key="f.id" class="flex justify-between bg-slate-700 rounded px-3 py-2">
              <span>{{ f.title }}</span>
            </div>
            <p v-if="!theatreFilms.length" class="text-sm text-gray-400">Selles kinos pole veel filme.</p>
          </div>
        </div>
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Seo film kinoga</h3>
          <select v-model.number="manageSelectionFilm" class="input">
            <option :value="null">Vali film</option>
            <option v-for="f in films" :key="f.id" :value="f.id">{{ f.title }}</option>
          </select>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-gray-400">Alguskuupäev</label>
              <input v-model="scheduleStart" type="date" class="input" />
            </div>
            <div>
              <label class="text-xs text-gray-400">Lõppkuupäev</label>
              <input v-model="scheduleEnd" type="date" class="input" />
            </div>
          </div>
          <button
            class="btn"
            :disabled="!manageSelectionFilm || !manageTheatreId"
            @click="() => { if (manageSelectionFilm && manageTheatreId) handleAssignFilmToTheatre(manageSelectionFilm, manageTheatreId) }"
            >
            Seo kinoga
          </button>
          <button
            class="btn-outline w-full"
            :disabled="!manageSelectionFilm || !manageTheatreId || !scheduleStart || !scheduleEnd"
            @click="handleAutoSchedule"
          >
            Auto-graafik (09:00-22:00, 1h vahed)
          </button>
          <p class="text-xs text-gray-400">Seostamine liigutab filmi valitud kinno (üks film ühes kinos).</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Seansid siin kinos</h3>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="st in theatreShowtimes"
              :key="st.id"
              class="flex justify-between items-center bg-slate-700 rounded px-3 py-2 text-sm"
            >
              <div>
                <p class="font-semibold">{{ st.filmTitle }}</p>
                <p class="text-xs text-gray-300">{{ new Date(st.startsAt).toLocaleString() }}</p>
              </div>
              <button class="text-red-300" @click="handleDeleteShowtime(st.id, manageTheatreId)">Kustuta</button>
            </div>
            <p v-if="!theatreShowtimes.length" class="text-xs text-gray-400">Seansse veel pole.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Seo film kinoga</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm text-gray-300 block mb-1">Kino</label>
          <select v-model.number="manageTheatreId" class="input">
            <option :value="null">Vali kino</option>
            <option v-for="t in theatres" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-300 block mb-1">Film</label>
          <select v-model.number="manageSelectionFilm" class="input" :disabled="!manageTheatreId">
            <option :value="null">Vali film</option>
            <option v-for="f in films" :key="f.id" :value="f.id">{{ f.title }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-300 block mb-1">Saal</label>
          <select v-model.number="manageSelectionHall" class="input" :disabled="!manageTheatreId">
            <option :value="null">Suvaline saal</option>
            <option v-for="h in theatreHalls" :key="h.id" :value="h.id">{{ h.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-400">Alguskuupäev</label>
            <input v-model="scheduleStart" type="date" class="input" :disabled="!manageSelectionFilm || !manageTheatreId" />
          </div>
          <div>
            <label class="text-xs text-gray-400">Lõppkuupäev</label>
            <input v-model="scheduleEnd" type="date" class="input" :disabled="!manageSelectionFilm || !manageTheatreId" />
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 mt-4">
        <button
          class="btn"
          :disabled="!manageSelectionFilm || !manageTheatreId"
          @click="() => { if (manageSelectionFilm && manageTheatreId) handleAssignFilmToTheatre(manageSelectionFilm, manageTheatreId) }"
        >
          Seo kinoga
        </button>
        <button
          class="btn-outline"
          :disabled="!manageSelectionFilm || !manageTheatreId || !scheduleStart || !scheduleEnd"
          @click="handleAutoSchedule"
        >
          Auto-graafik (09:00-22:00, 1h vahed)
        </button>
        <p class="text-xs text-gray-400 mt-2">Seostamine liigutab filmi valitud kinno; auto-graafik loob kuupäevade vahemikus päevased seansid.</p>
      </div>
    </section>

    <section class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Žanrid</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <input v-model="genreForm.name" class="input" placeholder="Žanri nimi" />
          <div class="flex gap-2">
            <button class="btn" @click="handleSaveGenre">{{ genreForm.id ? 'Salvesta žanr' : 'Lisa žanr' }}</button>
            <button v-if="genreForm.id" class="btn-outline" @click="genreForm = { id: null, name: '' }">Tühista</button>
          </div>
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div v-for="g in genres" :key="g.id" class="flex justify-between bg-slate-700 rounded px-3 py-2">
            <span>{{ g.name }}</span>
            <div class="flex gap-2 text-sm">
              <button class="text-blue-300" @click="startEditGenre(g)">Muuda</button>
              <button class="text-red-300" @click="handleDeleteGenre(g.id)">Kustuta</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isSuper" class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Kasutajad</h2>
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div class="space-y-3">
          <input v-model="newUser.email" class="input" placeholder="E-post" />
          <input v-model="newUser.password" type="password" class="input" placeholder="Parool" />
          <select v-model="newUser.role" class="input">
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button class="btn" @click="handleCreateUser">Loo kasutaja</button>
        </div>
        <p class="text-sm text-gray-400">
          Ainult super-adminid saavad kontosid luua. Lisa e-post, parool ja vali roll. Uus kasutaja salvestatakse kohe.
        </p>
      </div>
      <div class="flex gap-3 items-center mb-4">
        <select v-model.number="targetUserId" class="input">
          <option :value="null">Vali kasutaja</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }} ({{ u.role }})</option>
        </select>
        <select v-model="targetRole" class="input">
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>
        <button class="btn" @click="handleUpdateRole">Uuenda rolli</button>
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div v-for="u in users" :key="u.id" class="flex justify-between bg-slate-700 rounded px-3 py-2">
          <span>{{ u.email }} ({{ u.role }})</span>
          <button class="text-red-300" @click="handleDeleteUser(u.id)">Kustuta</button>
        </div>
      </div>
    </section>

    <section v-if="isSuper" class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Kinod</h2>
      <div class="flex gap-3 items-center mb-4">
        <input v-model="theatreName" class="input" placeholder="Kino nimi" />
        <input v-model="theatreCity" class="input" placeholder="Linn" />
        <button class="btn" @click="handleCreateTheatre">Lisa</button>
      </div>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div v-for="t in theatres" :key="t.id" class="bg-slate-700 rounded px-3 py-2">
          <div class="flex justify-between items-center">
            <span>{{ t.name }}</span>
            <div class="flex gap-2">
              <button class="text-blue-300 text-sm" @click="() => { manageTheatreId.value = t.id; manageSelectionFilm.value = null; loadTheatreFilms(t.id) }">Vaata kava</button>
              <button class="text-red-300 text-sm" @click="handleDeleteTheatre(t.id)">Kustuta</button>
            </div>
          </div>
          <div v-if="manageTheatreId === t.id" class="mt-2 space-y-2 border border-slate-600 rounded p-3">
            <h3 class="font-semibold text-sm">Siin jooksvad filmid</h3>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div v-for="f in theatreFilms" :key="f.id" class="flex justify-between bg-slate-800 px-2 py-1 rounded">
                <span>{{ f.title }}</span>
                <div class="flex gap-2 text-xs">
                  <button class="text-blue-300" @click="startEditFilm(f)">Muuda</button>
                  <button class="text-red-300" @click="handleAssignFilmToTheatre(f.id, null)">Eemalda</button>
                </div>
              </div>
              <p v-if="!theatreFilms.length" class="text-xs text-gray-400">Filme pole seotud.</p>
            </div>
            <div class="space-y-2">
              <select v-model.number="manageSelectionFilm" class="input">
                <option :value="null">Vali film seostamiseks</option>
                <option v-for="f in films" :key="f.id" :value="f.id">{{ f.title }}</option>
              </select>
              <button
                class="btn"
                :disabled="!manageSelectionFilm"
                @click="() => { if (manageSelectionFilm) handleAssignFilmToTheatre(manageSelectionFilm, t.id) }"
              >
                Seo selle kinoga
              </button>
              <p class="text-xs text-gray-400">Seostamine liigutab filmi valitud kinno; ilma kinota filmid jäävad seostamata.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.input {
  width: 100%;
  border-radius: 0.5rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 0.5rem 0.75rem;
  color: #e2e8f0;
  font-size: 0.875rem;
}
.btn {
  background: #6366f1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.btn:hover { background: #4f46e5; }
.btn-outline {
  border: 1px solid #4f46e5;
  color: #cbd5ff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: transparent;
}
.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
