<template>
  <article class="movie-card">
    <div class="poster" :style="{ backgroundImage: `url(${movie.poster})` }"></div>
    <div class="info">
      <h2 class="title">{{ movie.title }}</h2>
      <p class="genres">{{ movie.genres?.join(' • ') || '—' }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Movie {
  id: number | string
  title: string
  genres?: string[]
  poster?: string
}

const props = defineProps<{ movie: Movie }>()

</script>
<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 260px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  background-size: cover;
  background-position: center;
}

.info {
  padding: 0.8rem 1rem;
  text-align: center;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #111827;
}

.genres {
  font-size: 0.9rem;
  color: #6b7280;
}
</style>

