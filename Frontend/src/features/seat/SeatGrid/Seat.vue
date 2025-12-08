<script setup lang="ts">
import SeatDTO from '../../../../../shared/types/SeatDTO';
import Double from '../../../assets/Double.svg'
import Premium from '../../../assets/Premium.svg'
import Standard from '../../../assets/Standard.svg'
import { seats_status, seats_type } from '@prisma/client';


interface localSeatDTO extends Omit<SeatDTO, 'status'> {
  status: seats_status | 'selected'
}

const props = defineProps<{
  seat: localSeatDTO
}>();

const emit = defineEmits<{
  (e: 'seat-clicked'): void
}>();


function color() {
  switch (props.seat.status) {
    case 'available':
      return '#ffec99'
    case 'taken':
      return '#e03131'
    case 'selected':
      return '#2f9e44'
  }
}

function icon(): string {
  switch (props.seat.type) {
    case seats_type.Double:
      return Double
    case seats_type.Premium:
      return Premium
    case seats_type.Standard:
      return Standard
    default:
      return 'Type not identified'
  }

}

function setStatus(new_status: seats_status | 'selected') {
  props.seat.status = new_status;
}

function handleClick() {
  const seat_status = props.seat.status
  switch (seat_status) {
    case 'available':
      setStatus('selected');
      emit('seat-clicked');
      break;
    case 'selected':
      setStatus('available');
      emit('seat-clicked');
      break;
    case 'taken':
      break;
  }
}

function size() {
  switch (props.seat.type) {
    case seats_type.Standard:
    case seats_type.Premium:
      return 'h-8 w-8'
    case seats_type.Double:
      return 'h-8 w-16'
  }
}


</script>
<template>
  <component @click="handleClick()" :is="icon()" :color="color()"
    :class="[size(), 'bg-no-repeat', 'bg-contain', 'bg-center']">
  </component>
</template>
