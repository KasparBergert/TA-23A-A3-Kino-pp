<script lang="ts" setup>
import { onBeforeMount, ref, computed } from "vue";
import useTicketCreatorStore from "../stores/useTicketCreatorStore";
import formatUnixTimeToHHMM from "../utils/formatUnixTimeToHHMM";
import TheSeatLayout from "../components/TheSeatLayout.vue";
import type Seat from "../types/Seat";

const ticketStore = useTicketCreatorStore();

const ticketMetaData = ref();
onBeforeMount(() => {
  if (!ticketStore.currentShowtime || !ticketStore.chosenSeats) {
    //cannot be on this page if showtime or seats have not been selected.
    window.location.href = "/";
    return;
  }

  ticketMetaData.value = {
    movie_poster: ticketStore.currentShowtime?.film.poster_url,
    movie_title: ticketStore.currentShowtime?.film.title,
    movie_duration: ticketStore.currentShowtime?.film.duration_min,
    hall_name: ticketStore.currentShowtime?.hall.name,
    theatre_name: ticketStore.currentShowtime?.theatre_name,
    start_at: formatUnixTimeToHHMM(ticketStore.currentShowtime.starts_at),
    ends_at: formatUnixTimeToHHMM(ticketStore.currentShowtime.ends_at),
  };
});

//purpose, show every piece of data what the user is about to buy
//create buy now button that will redirect the user to the buy page
//multiple seats correspond to multiple tickets

const preset_seats = computed<Seat[]>(() => {
  console.log(ticketStore.chosenSeats);

  const result: Seat[] = [];

  for (const seat of ticketStore.currentShowtimeSeats) {
    let curSeat = seat;
    for (const chosenSeat of ticketStore.chosenSeats) {
      if (chosenSeat.col === seat.col && seat.row === chosenSeat.row) {
        curSeat = { ...seat, is_selected: chosenSeat.is_selected ?? false };
        break;
      }
    }
    result.push(seat);
  }
  return result;
});
</script>
<template>
  <div class="flex w-screen justify-center h-screen">
    <div class="bg-slate-800 w-[50%] flex justify-center items-center">
      <img :src="ticketMetaData.movie_poster" class="aspect-2/3 h-[87%]" />
    </div>
    <div
      class="flex flex-col bg-slate-900 w-[50%] text-white justify-center items-center"
    >
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-1">
          <p class="font-bold text-6xl">{{ ticketMetaData.movie_title }}</p>
          <p class="text-4xl">
            Theatre: <span class="font-bold">{{ ticketMetaData.theatre_name }}</span>
          </p>
          <p class="text-2xl">
            Hall: <span class="font-bold">{{ ticketMetaData.hall_name }}</span>
          </p>
          <p class="text-2xl">{{ ticketMetaData.movie_duration }} minutes</p>
          <p class="">Starts at: {{ ticketMetaData.start_at }}</p>
          <p class="">Ends at:{{ ticketMetaData.ends_at }}</p>
        </div>
        <div>
          <TheSeatLayout :noSelect="true" :presetSeats="preset_seats" />
        </div>
      </div>
      <button class="bg-white text-black rounded-md px-4 py-2 mt-8 cursor-pointer">
        Continue to checkout
      </button>
    </div>
  </div>
</template>
