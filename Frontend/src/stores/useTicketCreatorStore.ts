import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type ShowtimeType from '../types/ShowtimeType';
import type Seat from '../types/Seat';
import client from '../utils/api';

//used to eventually send the necessary data for the user to receive a ticket.
const useTicketCreatorStore = defineStore('ticketCreate', () => {
  const currentShowtime = ref<ShowtimeType>();
  const currentShowtimeSeats = ref<Seat[]>([]);
  const chosenSeats = ref<Seat[]>([]);

  watch(currentShowtime, async () => {

    //HARD CODED
    currentShowtimeSeats.value = [
      {
        row: "A",
        col: 0,
        is_available: false
      },
      {
        row: "A",
        col: 1,
        is_available: false
      },
      {
        row: "A",
        col: 2,
        is_available: false
      },
      {
        row: "A",
        col: 3,
        is_available: false
      },{
        row: "A",
        col: 4,
        is_available: false
      },
      {
        row: "B",
        col: 0,
        is_available: true
      },
      {
        row: "B",
        col: 1,
        is_available: true
      },
      {
        row: "B",
        col: 2,
        is_available: true
      },
      {
        row: "B",
        col: 3,
        is_available: true
      },{
        row: "B",
        col: 4,
        is_available: true
      },
    ]

    //code right here man. the API call

  })

  watch(chosenSeats, () => {
    console.log(chosenSeats.value)
  })


  function setCurrentShowtime(showtime: ShowtimeType){
    currentShowtime.value = showtime;
  }

  function setChosenSeats(chosenSeats_param: Seat[]){
    chosenSeats.value = chosenSeats_param;
  }


  return {currentShowtime, setCurrentShowtime, currentShowtimeSeats, chosenSeats, setChosenSeats}
})

export default useTicketCreatorStore
