<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ShowtimeCard from '../components/ShowtimeCard.vue';
import ShowtimeFilter from "../types/ShowtimeFilter.ts"

import client from '../utils/api';




const route = useRoute();
const theatre_id = route.params.theatre_id
//should make a check to see if theatre_id is actually a number, not too long. user can put anything in there.

//send api the theatre_id
onMounted(async () => {
  try {

    const filter: ShowtimeFilter = {
      film_id: null,
      theatre_id: null ,
      starts_at: null,
      ends_at: null
    }
    //get the showtimes
    const response = await client.post(`/services/showtimes`, {
      data:{
        filter
      }
    });
    console.log(response.data)

  } catch (err) {
    console.error()
  }

})


</script>
<template>
  <div class="container">
    <h1>SHOWTIMES</h1>
    <ShowtimeCard/>
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
