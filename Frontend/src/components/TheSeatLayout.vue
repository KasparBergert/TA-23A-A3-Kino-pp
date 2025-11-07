<script lang="ts" setup>
import SeatSVG from '../assets/SeatSVG.vue';
import Seat from '../types/Seat';
import { reactive, ref } from 'vue';

interface SeatManager {
  value: Seat[]
  addSeat(seat: Seat): void
  removeSeat(seat: Seat): void
  hasSeat(seat: Seat): boolean
}

const { seats } = withDefaults(defineProps<{
  seats?: Seat[];
}>(), {
  seats: () => [{
    row: "A",
    col: 0,
    is_available: true,
  },
  {
    row: "A",
    col: 1,
    is_available: true,
  },
  {
    row: "A",
    col: 2,
    is_available: true,
  },
  {
    row: "B",
    col: 0,
    is_available: true,
  },
  {
    row: "B",
    col: 1,
    is_available: true,
  },
  {
    row: "B",
    col: 2,
    is_available: false,
  },
  ],
})

const emit = defineEmits<{
  (e: 'selected-seats', value: Seat[]): void;
}>()

//count how many unique rows there are and the biggest column number to create the grid
const rows = Array.from(new Set(seats.map(seat => seat.row))).length;
const cols = Math.max(...seats.map(seat => seat.col)) + 1;

type SeatStatus = { is_available: boolean, is_selected: boolean }
const seat_colors = ref<SeatStatus[]>([]);

//setting the seat colors
for (let seat of seats) {
  let { is_available, is_selected } = seat;
  is_selected = is_selected ? is_selected : false;
  is_available = is_available ? is_available : false; // is_available is only the database reference, to check if its taken or not.
  seat_colors.value.push({ is_available, is_selected });
}


//used to add and remove seats when user clicks on the seat layout
//cannot use Set's because Vue makes it weird and impossible due to reactivity
const selected_seats = reactive<SeatManager>({
  value: [] as Seat[],
  addSeat(seat: Seat) {
    const exists = this.hasSeat(seat);
    if (!exists) {
      this.value.push(seat)
    }
  },
  removeSeat(seat: Seat) {
    this.value = this.value.filter(p_seat => p_seat.col != seat.col || p_seat.row != seat.row);
  },
  hasSeat(seat: Seat) {
    return this.value.find(p_seat => p_seat.col == seat.col && p_seat.row == seat.row)
  }
});

const handleSeatClick = (seat: Seat, i: number) => {

  if(!seat_colors.value[i]) return;

  const { row, col, is_available } = seat;
  //check if seat is already taken
  if (!is_available) {
    return;
  }

  //check if seat is already selected
  if (selected_seats.hasSeat({ row, col })) {
    //remove the seat from selection
    selected_seats.removeSeat({ row, col });
    seat_colors.value[i].is_selected = false;
  } else {
    //select the seat
    selected_seats.addSeat({ row, col });
    seat_colors.value[i].is_selected = true;
  }

  //emit event to parent component
  emit('selected-seats', selected_seats.value);
}

</script>
<template>
  <div class="seat-layout w-fill min-w-md select-none cursor-pointer justify-items-center items-center"
    :style="{ '--rows': rows, '--cols': cols }">
    <SeatSVG
    :is_available="seat_colors[i]?.is_available ?? false"
    :is_selected="seat_colors[i]?.is_selected ?? false"
    v-for="seat, i in seats"
    :key="i"
    class="w-8 h-8 transform rotate-180"
    @click="handleSeatClick(seat, i)" />
  </div>
</template>
<style scoped>
.seat-layout {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(40px, min-content));
  grid-template-rows: repeat(var(--rows), minmax(40px, min-content));
  gap: 10px 0px;
  justify-content: center;
  align-items: center;
}
</style>
