<script setup lang="ts">
import authStore from '../store/AuthStore'
import TheNavbar from '../widgets/TheNavbar.vue'
</script>

<template>
  <TheNavbar />
  <main class="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center gap-4 p-6">
    <h1 class="text-3xl font-semibold">About</h1>
    <p class="text-lg text-gray-300">Welcome to HanKas Cinema admin panel demo.</p>
    <div v-if="authStore.user.value" class="bg-slate-800 px-4 py-3 rounded-lg">
      Logged in as <strong>{{ authStore.user.value.email }}</strong> ({{ authStore.user.value.role }})
    </div>
    <button
      v-if="authStore.user.value"
      class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
      @click="authStore.logout"
    >
      Log out
    </button>
  </main>
</template>
