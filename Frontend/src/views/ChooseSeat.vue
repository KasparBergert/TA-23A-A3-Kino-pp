<script lang="js" setup>
import { onBeforeMount, onMounted, reactive, ref, watchEffect } from 'vue';
import useTicketCreatorStore from '../stores/useTicketCreatorStore';
import BackgroundGlow from '../components/BackgroundGlow.vue';
import TheSeatLayout from '../components/TheSeatLayout.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const ticketCreator = useTicketCreatorStore();
onBeforeMount(() => {
  if (!ticketCreator.currentShowtime){
    //redirect to home if no showtime is selected
    window.location.href = '/';
  }
});

function handleBuyTicket(){
  router.push({ name: 'ticketSummary'})
}
</script>
<template>
  <main
    class="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-full w-full min-h-screen flex items-center justify-center overflow-hidden relative text-white"
  >
    <BackgroundGlow />
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-semibold mb-6">Vali kohad</h1>
      <TheSeatLayout />
      <button
        class="w-64 mt-5 px-5 py-3 rounded-lg font-semibold text-black hover:text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 select-none cursor-pointer"
        @click="handleBuyTicket()"
      >
        Buy Ticket
      </button>
    </div>
  </main>
</template>
