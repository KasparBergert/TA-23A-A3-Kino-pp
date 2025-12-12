<script setup lang="ts">
import SeatDTO from "../../../../../shared/types/SeatDTO";
import { seats_status, seats_type } from "@prisma/client";

interface localSeatDTO extends Omit<SeatDTO, "status"> {
  status: seats_status | "selected";
}

const props = defineProps<{
  seat: localSeatDTO;
}>();

const emit = defineEmits<{
  (e: "seat-clicked"): void;
}>();

function color() {
  switch (props.seat.status) {
    case "available":
      return "#dbc76e";
    case "taken":
      return "#e03131";
    case "selected":
      return "#2f9e44";
  }
}

//this exists only because of strong type checking. otherwise, its abstraction.
function setStatus(new_status: seats_status | "selected") {
  props.seat.status = new_status;
}

function handleClick() {
  //changing status chanes color
  const seat_status = props.seat.status;
  switch (seat_status) {
    case "available":
      setStatus("selected");
      break;
    case "selected":
      setStatus("available");
      break;
    case "taken":
      break;
  }
  emit("seat-clicked");
}

function size() {
  switch (props.seat.type) {
    case seats_type.Standard:
    case seats_type.Premium:
      return "h-6 w-6";
    case seats_type.Double:
      return "h-6 w-12";
  }
}
</script>
<template>
  <div @click="handleClick()" :class="`${size()} bg-no-repeat bg-contain bg-center border-2 my-[0.2px] select-none cursor-pointer`"
    :style="{ backgroundColor: `${color()}` }"></div>
</template>
