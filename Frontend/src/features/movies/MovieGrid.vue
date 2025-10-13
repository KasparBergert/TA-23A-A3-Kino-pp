<script setup>
import MovieItem from './MovieItem.vue';

const props = defineProps({
  movies: Array
})

</script>

<template>
  <div class="movie-grid">
    <MovieItem v-for="(movie, index) in movies" :key="index" :image="movie.image" :title="movie.title" :genre="movie.genre" />
  </div>
</template>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}
</style>
