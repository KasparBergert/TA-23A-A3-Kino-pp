<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import ShowtimeCard from '../components/ShowtimeCard.vue';
import Showtime from '../types/ShowtimeType.ts';
import client from '../utils/api';


const route = useRoute();
const showtimes = ref<Showtime[]>([])

onMounted(async () => {
  try {
    //get the showtimes
    const response = await client.post('/services/showtimes', {
      film_id: null,
      theatre_id: Number(route.params.theatre_id),
    });
    showtimes.value = response.data.showtimes;
    console.log(response.data.showtimes);
  } catch (err) {
    console.error(err)
  }

})

</script>
<template>
  <div class="showtime-container">
    <ShowtimeCard v-for="(showtime, index) in showtimes" :key="index" :showtime="showtime" />
  </div>
</template>

<style lang="css" scoped>
.showtime-container {
  margin-top: 8em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap:20px;
}
</style>
