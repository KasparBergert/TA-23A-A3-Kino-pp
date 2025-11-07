import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type ShowtimeType from '../types/ShowtimeType';
import client from '../utils/api';

//used to eventually send the necessary data for the user to receive a ticket.
const useTicketCreatorStore = defineStore('ticketCreate', () => {
  const currentShowtime = ref<ShowtimeType>();
  const currentSeats = async() => {
    if(!currentShowtime){
      throw new Error('Showtime has not been set to receive the seats');
    }
    //request to get current seats
    //gets send hall_id
    /*
      row label
      seat number
      is_available
    */
    client.get('seats');
  }

  function setCurrentShowtime(showtime: ShowtimeType){
    currentShowtime.value = showtime;
  }

  return {currentShowtime, setCurrentShowtime, currentSeats}
})

export default useTicketCreatorStore
