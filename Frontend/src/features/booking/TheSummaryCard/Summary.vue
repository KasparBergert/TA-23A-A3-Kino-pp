<script setup lang="ts">
import type SeatDTO from '../../../../../shared/types/SeatDTO';

const seat_price_tmp = 12.5

defineProps<{
  seats: SeatDTO[]
}>();

</script>
<template>
  <div class="w-full text-left text-sm text-slate-300">
    <div class="flex justify-between mb-1">
      <span>Valitud kohti:</span>
      <span class="font-bold">{{ seats.length }}</span>
    </div>
    <div class="flex justify-between text-lg font-bold text-white">
      <span>Kokku:</span>
      <span>{{ (seats.length * seat_price_tmp).toFixed(2) }}€</span>
    </div>
  </div>
</template>
