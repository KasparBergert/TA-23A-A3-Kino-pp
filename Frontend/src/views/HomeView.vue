<script setup lang="ts">

import TheNavbar from "../components/TheNavbar.vue";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import BackgroundGlowComponent from "../components/BackgroundGlow.vue";
import ShowtimeSelector from "../components/ShowtimeSelector.vue";
import TopMovies from "../components/Top3Movies.vue";

</script>
<template>
  <Toaster />
  <TheNavbar />
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6"
  >
    <BackgroundGlowComponent />
    <div class="relative z-10 flex flex-col gap-20 w-full max-w-7xl">
      <ShowtimeSelector />
      <TopMovies />
    </div>
  </main>
</template>
