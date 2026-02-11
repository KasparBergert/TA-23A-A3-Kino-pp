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
} from '../entities/AdminService'
import type { film } from '@prisma/client'
import { theatreService } from '../entities/TheatreService'
import { analyticsService, type AnalyticsOverview } from '../entities/AnalyticsService'
import AnalyticsPanel from '../features/admin/AnalyticsPanel.vue'

const films = ref<film[]>([])
const users = ref<{ id: number; email: string; role: string }[]>([])
const theatres = ref<{ id: number; name: string }[]>([])
const theatreFilms = ref<film[]>([])
const manageTheatreId = ref<number | null>(null)
const manageSelectionFilm = ref<number | null>(null)
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

const role = computed(() => authStore.user.value?.role)
const isSuper = computed(() => role.value === 'super_admin')
const isAdmin = computed(() => role.value === 'admin' || role.value === 'super_admin')

async function loadFilms() {
  const data = await filmsService.getAll()
  films.value = data ?? []
}

async function loadTheatreFilms(theatreId: number) {
  const data = await filmsService.getByTheatre(theatreId)
  theatreFilms.value = data ?? []
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

async function loadAnalytics() {
  if (!isAdmin.value) return
  analytics.value = await analyticsService.getOverview()
}

async function handleCreateFilm() {
  if (editingFilmId.value) {
    await updateFilm(editingFilmId.value, { ...filmForm.value })
  } else {
    await createFilm(filmForm.value)
  }
  await loadFilms()
  await loadAnalytics()
  editingFilmId.value = null
  filmForm.value = { title: '', posterUrl: '', description: '', releaseDate: '', durationMin: null }
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
}

function cancelEdit() {
  editingFilmId.value = null
  filmForm.value = { title: '', posterUrl: '', description: '', releaseDate: '', durationMin: null }
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
  await createTheatre({ name: theatreName.value })
  theatreName.value = ''
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
})
</script>

<template>
  <TheNavbar />
  <main class="min-h-screen bg-slate-900 text-gray-100 p-6 flex flex-col gap-8">
    <header class="flex justify-between items-center">
      <h1 class="text-3xl font-semibold">Admin</h1>
      <p class="text-sm text-gray-300">Logged in as {{ authStore.user.value?.email }} ({{ authStore.user.value?.role }})</p>
    </header>

    <AnalyticsPanel :analytics="analytics" />

    <section class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Films</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <input v-model="filmForm.title" class="input" placeholder="Title" />
          <input v-model="filmForm.posterUrl" class="input" placeholder="Poster URL" />
          <input v-model="filmForm.description" class="input" placeholder="Description" />
          <input v-model="filmForm.releaseDate" class="input" placeholder="Release Date" />
          <input v-model.number="filmForm.durationMin" class="input" placeholder="Duration minutes" />
          <div class="flex gap-2">
            <button class="btn" @click="handleCreateFilm">{{ editingFilmId ? 'Save changes' : 'Create film' }}</button>
            <button v-if="editingFilmId" class="btn-outline" @click="cancelEdit">Cancel</button>
          </div>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div v-for="f in films" :key="f.id" class="flex justify-between items-center bg-slate-700 rounded px-3 py-2">
            <div>
              <span>{{ f.title }}</span>
              <p class="text-xs text-gray-400">Cinema: {{ f.theatreId ?? '—' }}</p>
            </div>
            <div class="flex gap-2">
              <button class="text-blue-300 text-sm" @click="startEditFilm(f)">Edit</button>
              <button class="text-red-300 text-sm" @click="handleDeleteFilm(f.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isManagingTheatre" class="mt-6 grid md:grid-cols-2 gap-4 border border-slate-700 rounded-xl p-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">Films at {{ theatres.find(t => t.id === manageTheatreId)?.name }}</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="f in theatreFilms" :key="f.id" class="flex justify-between bg-slate-700 rounded px-3 py-2">
              <span>{{ f.title }}</span>
            </div>
            <p v-if="!theatreFilms.length" class="text-sm text-gray-400">No films assigned to this cinema yet.</p>
          </div>
        </div>
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Assign film to this cinema</h3>
          <select v-model.number="manageSelectionFilm" class="input">
            <option :value="null">Select film to assign</option>
            <option v-for="f in films" :key="f.id" :value="f.id">{{ f.title }}</option>
          </select>
          <button
            class="btn"
            :disabled="!manageSelectionFilm || !manageTheatreId"
            @click="() => { if (manageSelectionFilm && manageTheatreId) handleAssignFilmToTheatre(manageSelectionFilm, manageTheatreId) }"
          >
            Assign to cinema
          </button>
          <p class="text-xs text-gray-400">Assigning moves the film to this cinema (each film belongs to one cinema).</p>
        </div>
      </div>
    </section>

    <section v-if="isSuper" class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Users</h2>
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div class="space-y-3">
          <input v-model="newUser.email" class="input" placeholder="Email" />
          <input v-model="newUser.password" type="password" class="input" placeholder="Password" />
          <select v-model="newUser.role" class="input">
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button class="btn" @click="handleCreateUser">Create user</button>
        </div>
        <p class="text-sm text-gray-400">
          Only super admins can create accounts. Provide an email, password, and select the role. The new user is saved immediately.
        </p>
      </div>
      <div class="flex gap-3 items-center mb-4">
        <select v-model.number="targetUserId" class="input">
          <option :value="null">Select user</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.email }} ({{ u.role }})</option>
        </select>
        <select v-model="targetRole" class="input">
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>
        <button class="btn" @click="handleUpdateRole">Update role</button>
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div v-for="u in users" :key="u.id" class="flex justify-between bg-slate-700 rounded px-3 py-2">
          <span>{{ u.email }} ({{ u.role }})</span>
          <button class="text-red-300" @click="handleDeleteUser(u.id)">Delete</button>
        </div>
      </div>
    </section>

    <section v-if="isSuper" class="bg-slate-800 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Cinemas</h2>
      <div class="flex gap-3 items-center mb-4">
        <input v-model="theatreName" class="input" placeholder="New theatre name" />
        <button class="btn" @click="handleCreateTheatre">Create</button>
      </div>
      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div v-for="t in theatres" :key="t.id" class="bg-slate-700 rounded px-3 py-2">
          <div class="flex justify-between items-center">
            <span>{{ t.name }}</span>
            <div class="flex gap-2">
              <button class="text-blue-300 text-sm" @click="() => { manageTheatreId.value = t.id; manageSelectionFilm.value = null; loadTheatreFilms(t.id) }">View lineup</button>
              <button class="text-red-300 text-sm" @click="handleDeleteTheatre(t.id)">Delete</button>
            </div>
          </div>
          <div v-if="manageTheatreId === t.id" class="mt-2 space-y-2 border border-slate-600 rounded p-3">
            <h3 class="font-semibold text-sm">Films showing here</h3>
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div v-for="f in theatreFilms" :key="f.id" class="flex justify-between bg-slate-800 px-2 py-1 rounded">
                <span>{{ f.title }}</span>
                <div class="flex gap-2 text-xs">
                  <button class="text-blue-300" @click="startEditFilm(f)">Edit</button>
                  <button class="text-red-300" @click="handleAssignFilmToTheatre(f.id, null)">Remove</button>
                </div>
              </div>
              <p v-if="!theatreFilms.length" class="text-xs text-gray-400">No films assigned.</p>
            </div>
            <div class="space-y-2">
              <select v-model.number="manageSelectionFilm" class="input">
                <option :value="null">Select film to assign</option>
                <option v-for="f in films" :key="f.id" :value="f.id">{{ f.title }}</option>
              </select>
              <button
                class="btn"
                :disabled="!manageSelectionFilm"
                @click="() => { if (manageSelectionFilm) handleAssignFilmToTheatre(manageSelectionFilm, t.id) }"
              >
                Assign to this cinema
              </button>
              <p class="text-xs text-gray-400">Assigning moves the film to this cinema; films with no cinema stay unassigned.</p>
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
