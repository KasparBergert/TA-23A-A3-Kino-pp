<script setup>

const props = defineProps({
  image: String,
  title: String,
  genre: String
})

</script>
<template>

  <div class="movie-card">
    <img :src="image" :alt="title" class="movie-image" />
    <div class="movie-info">
      <h2 class="movie-title">{{ title }}</h2>
      <p class="movie-genre">{{ genre }}</p>
    </div>
  </div>

</template>

<style scoped>


.movie-card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.movie-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.movie-image {
  width: 100%;
  height: 14rem;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
}

.movie-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.movie-genre {
  font-size: 0.875rem;
  color: #6b7280;
}

</style>
