<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const showtimeId = route.query.showtime_id as string;

console.log(showtimeId)
</script>
<template>

show a 2D grid of seats. fetch the seats from a hall.

1. fetch the showtime hall seats
2. display them in a grid
2.1 disable selection of already booked seats
3. user selectes seats
4. user confirms selection and goes to payment page

</template>
