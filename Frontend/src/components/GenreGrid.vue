<script setup>
import { ref } from 'vue'

const genres = ref([
  { name: 'Comedy', color: 'from-yellow-400 to-orange-500' },
  { name: 'Action', color: 'from-red-500 to-rose-600' },
  { name: 'Thriller', color: 'from-purple-500 to-indigo-600' },
  { name: 'Animation', color: 'from-blue-400 to-teal-500' },
]);
</script>
<template>
  <section class="text-center mt-10">
    <h2 class="text-2xl font-bold mb-8 text-gray-100">ŽANRID</h2>
    <div class="grid gap-6 sm:gap-8 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] max-w-5xl mx-auto">
      <div v-for="genre in genres" :key="genre.name"
        class="cursor-pointer bg-gradient-to-br p-6 rounded-2xl text-white font-semibold text-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
        :class="genre.color">
        {{ genre.name }}
      </div>
    </div>
  </section>
</template>
