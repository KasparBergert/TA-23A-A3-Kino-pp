<script setup lang="ts">
import { computed } from "vue"
import { open } from "../utils/modal"
import FormLogin from "../features/auth/FormLogin.vue"
import FormRegister from "../features/auth/FormRegister.vue"
import authStore from "../store/AuthStore"
import orderStore from "../store/OrderStore"
import { bookingService } from "../entities/BookingService"

const props = defineProps<{
  showSearch?: boolean
  search?: string
  suggestions?: { id: number; title: string; posterUrl?: string | null }[]
}>()
const emit = defineEmits<{
  (e: 'update:search', value: string): void
}>()

const openLogin = () => open(FormLogin)
const openRegister = () => open(FormRegister)
const logout = () => authStore.logout()

const showAdminLink = computed(() => authStore.isAdmin.value)
const activeOrder = computed(() => orderStore.getOrderId())
</script>
<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/" class="navbar-title">HanKas Kino</RouterLink>
      <RouterLink to="/" class="nav-btn nav-home">Avaleht</RouterLink>
      <RouterLink
        :to="{ name: 'showtimes', query: { theatreId: 0 } }"
        class="nav-btn"
      >
        Kinokava
      </RouterLink>
    </div>
    <div v-if="props.showSearch" class="nav-search">
      <input
        :value="props.search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        placeholder="Otsi filme"
        class="search-input"
      />
      <div v-if="props.search" class="search-dropdown">
        <RouterLink
          v-for="film in props.suggestions || []"
          :key="film.id"
          :to="`/films/${film.id}`"
          class="result-row"
        >
          <img
            v-if="film.posterUrl"
            :src="film.posterUrl"
            alt=""
            class="thumb"
          />
          <div class="title">{{ film.title }}</div>
        </RouterLink>
        <div v-if="!props.suggestions?.length" class="result-empty">No matches</div>
      </div>
    </div>
    <div class="navbar-right">
      <template v-if="!authStore.isAuthenticated.value">
        <button @click="openLogin" class="nav-btn">Logi sisse</button>
        <button @click="openRegister" class="nav-btn">Loo konto</button>
      </template>
      <template v-else>
        <div class="user-menu" tabindex="0">
          <button class="nav-btn user-trigger" aria-haspopup="true" aria-expanded="false">
            {{ authStore.displayName.value }}
            <span class="caret">▾</span>
          </button>
          <div class="dropdown">
            <RouterLink to="/orders" class="dropdown-item">Minu broneeringud</RouterLink>
            <a v-if="showAdminLink" href="/admin" class="dropdown-item">Admin</a>
            <button class="dropdown-item" @click="logout">Sign out</button>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<style scoped>
/* Layout */
.navbar {
  background: rgba(8, 25, 179, 0.301);
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color:white;
  text-decoration: none;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-right {
  display: flex;
  gap: 1rem;
}

.nav-search {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
}

.search-input {
  width: min(480px, 100%);
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  width: min(520px, 100%);
  background: #0b162a;
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.35);
  overflow: hidden;
  z-index: 20;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  color: #e2e8f0;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.result-row:hover {
  background: #1d2a44;
  color: #60a5fa;
}

.thumb {
  width: 42px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.35rem;
  background: #1e293b;
}

.title {
  font-weight: 600;
  line-height: 1.2;
}

.result-empty {
  padding: 0.65rem 0.9rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.nav-btn {
  color:white;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
}
.nav-btn:hover {
  color: #269af8;
}

.user-menu {
  position: relative;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #e2e8f0;
}

.caret { font-size: 0.9rem; }

.dropdown {
  position: absolute;
  top: 115%;
  right: 0;
  background: #0b1c38;
  border: 1px solid #1f3b77;
  border-radius: 0.5rem;
  padding: 0.35rem 0;
  min-width: 10rem;
  display: none;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  z-index: 10;
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  color: #dbeafe;
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #16294f;
  color: #60a5fa;
}

.user-menu:hover .dropdown,
.user-menu:focus-within .dropdown {
  display: flex;
}
</style>
