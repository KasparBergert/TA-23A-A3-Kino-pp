<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SeatGrid from '../components/SeatGrid/SeatGrid.vue';
import type SeatDTO from '../../../shared/types/SeatDTO';
import orderStore from '../store/OrderStore';
import { useValidatedNumberQuery } from '../utils/useValidatedNumberQuery';

const route = useRouter();
const hall_id: number = useValidatedNumberQuery('hall_id');

const selectedSeats = ref<SeatDTO[]>([]);

function proceedToSummary() {
  orderStore.setChosenSeats(selectedSeats.value);
  route.push({ name: 'summary' });
}

</script>
<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <SeatGrid :hallId="hall_id" v-model:selected-seats="selectedSeats" />
    <button @click="proceedToSummary" class="select-none py-2.5 px-8 inline-flex items-center justify-center text-sm font-semibold
       text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700
      rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">Jätka
      osutga
    </button>
  </div>
</template>
