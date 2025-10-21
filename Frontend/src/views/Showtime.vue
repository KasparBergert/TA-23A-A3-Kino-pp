<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ShowtimeCard from '../components/ShowtimeCard.vue';
import client from '../utils/api';

const route = useRoute();
const theatre_id = route.params.theatre_id
//should make a check to see if theatre_id is actually a number, not too long. user can put anything in there.

//send api the theatre_id
onMounted(async () => {
  try {

    //get the showtimes
    const showtimes = await client.get(`/services/showtimes?theatre_id=${theatre_id}`);
    console.log(showtimes.data)

  } catch (err) {
    console.error()
  }

})


</script>
<template>
  <div class="container">
    <h1>SHOWTIMES</h1>
    <ShowtimeCard title>
      <template #title>

      </template>

    </ShowtimeCard>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100svw;
  height: 100svh;
}
</style>
