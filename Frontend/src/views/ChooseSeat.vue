<script lang="js" setup>
import { onBeforeMount, onMounted, reactive, ref, watchEffect } from 'vue';
import useTicketCreatorStore from '../stores/useTicketCreatorStore';
import BackgroundGlow from '../components/BackgroundGlow.vue';
import TheSeatLayout from '../components/TheSeatLayout.vue';


const ticketCreator = useTicketCreatorStore();
onBeforeMount(() => {
  if (!ticketCreator.currentShowtime) {
    //redirect to home if no showtime is selected
    window.location.href = '/';
  }
});

const chosenSeats = ref();

watchEffect(() => {
  console.log(chosenSeats.value)
})

</script>
<template>
  <main
    class="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-full w-full min-h-screen flex items-center justify-center overflow-hidden relative text-white">
    <BackgroundGlow />
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-semibold mb-6">Vali kohad</h1>
      <TheSeatLayout
      :seats="ticketCreator.currentShowtimeSeats"
      v-model:selected-seats="ticketCreator.chosenSeats"/>
    </div>
  </main>

</template>
