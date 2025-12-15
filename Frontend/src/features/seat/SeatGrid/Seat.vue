<script setup lang="ts">
import { reactive } from "vue";
import type localSeatDTO from "./localSeaDTO";
import type SeatDTO from "../../../../../shared/types/SeatDTO";

const props = defineProps<{
  seat: SeatDTO;
}>();

const localSeat = reactive<localSeatDTO>({
  ...props.seat,
  status: props.seat.isTaken ? "taken" : "available",
});

const emit = defineEmits<{
  (e: "seat-clicked"): void;
}>();

function color() {
  switch (localSeat.status) {
    case "available":
      return "#dbc76e";
    case "taken":
      return "#e03131";
    case "selected":
      return "#2f9e44";
  }
}

//this exists only because of strong type checking. otherwise, its abstraction.
function setStatus(new_status: 'available' | 'taken' | "selected") {
  localSeat.status = new_status;
}

function handleClick() {
  switch (localSeat.status) {
    case "available":
      setStatus("selected");
      emit("seat-clicked");
      break;
    case "selected":
      setStatus("available");
      emit("seat-clicked");
      break;
    case "taken":
      break;
  }

}

function size() {
  switch (localSeat.type) {
    case 'Standard':
    case 'Premium':
      return "h-6 w-6";
    case 'Double':
      return "h-6 w-12";
  }
}

</script>
<template>
  <div @click="handleClick()"
    :class="`${size()} bg-no-repeat bg-contain bg-center border-2 my-[0.2px] select-none cursor-pointer`"
    :style="{ backgroundColor: `${color()}` }"></div>
</template>
