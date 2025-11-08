import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type ShowtimeType from '../types/ShowtimeType';
import client from '../utils/api';

//used to eventually send the necessary data for the user to receive a ticket.
const useTicketCreatorStore = defineStore('ticketCreate', () => {
  const currentShowtime = ref<ShowtimeType>();
  const currentShowtimeSeats = ref();

  watch(currentShowtime, async () => {
    if(!currentShowtime.value){ return; }

    //code right here man. the API call

  })

  const chosenSeats = ref();

  function setCurrentShowtime(showtime: ShowtimeType){
    currentShowtime.value = showtime;
  }

  return {currentShowtime, setCurrentShowtime, currentShowtimeSeats, chosenSeats}
})

export default useTicketCreatorStore
