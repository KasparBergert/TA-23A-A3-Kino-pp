<script setup lang="ts">
import SeatDTO from '../../../../../shared/types/SeatDTO';
import { ref, watch } from 'vue';
import orderStore from '../../../store/OrderStore';

const price = ref(0)

const props = defineProps<{
  seats: SeatDTO[]
}>();

watch(() => props.seats.length, async () => {
  price.value = await orderStore.getPayingPrice();
})

</script>
<template>
  <div class="w-full text-left text-sm text-slate-300">
    <div class="flex justify-between mb-1">
      <span>Valitud kohti:</span>
      <span class="font-bold">{{ seats.length }}</span>
    </div>
    <div class="flex justify-between text-lg font-bold text-white">
      <span>Kokku:</span>
      <span>{{ price }}€</span>
    </div>
  </div>
</template>
