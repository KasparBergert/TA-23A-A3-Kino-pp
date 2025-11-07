<script lang="js" setup>
import { onMounted } from 'vue';
import useTicketCreatorStore from '../stores/useTicketCreatorStore';
import BackgroundGlow from '../components/BackgroundGlow.vue';
import TheSeatLayout from '../components/TheSeatLayout.vue';

const ticketCreator = useTicketCreatorStore();
onMounted(() => {
  if (!ticketCreator.currentShowtime) {
    //redirect to home if no showtime is selected
    window.location.href = '/';
  }
});

//the client should only send information once over the network
// so that we don't bomb the server with requests

// this means holding the showtime in a store is necessary
// to be able to access it across different views



</script>
<template>
  <main
    class="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-full w-full min-h-screen flex items-center justify-center overflow-hidden relative text-white">
    <BackgroundGlow />
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-semibold mb-6">Vali kohad</h1>
      <TheSeatLayout :seats="seats" @selected-seats="(seats) => {console.log(seats)}"/>
    </div>
  </main>

</template>
