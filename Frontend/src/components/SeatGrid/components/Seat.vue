<script setup lang="ts">
import { ref, watch } from 'vue';
import SeatDTO from '../../../../../shared/types/SeatDTO';

const props = defineProps<{
  seat: SeatDTO
}>();

const emit = defineEmits<{
  (e: 'seat-clicked'): void
}>();

enum SeatStatus {
  Available = 0,
  Taken = 1,
  Selected = 2
}

const status = ref<SeatStatus>(props.seat.is_available as SeatStatus);
const color = ref<string>(getColor(status.value));

watch(() => status.value,
  (newStatus: SeatStatus) => {
    color.value = getColor(newStatus);
  }
);

// Assuming SeatStatus is an enum or constant:
// export enum SeatStatus { Available, Taken, Selected }

function getColor(status: SeatStatus): string {
  switch (status) {
    case SeatStatus.Available:
      return '#FFFFFF';
    case SeatStatus.Taken:
      return '#333333';
    case SeatStatus.Selected:
      return '#2563EB';
    default:
      return '#000000';
  }
}

function handleSeatClick() {
  const currentStatus = status.value;

  switch (currentStatus) {
    case SeatStatus.Available:
      status.value = SeatStatus.Selected;
      emit('seat-clicked');
      break;

    case SeatStatus.Selected:
      status.value = SeatStatus.Available;
      emit('seat-clicked');
      break;

    case SeatStatus.Taken:
      break;

    default:
      break;
  }
}

</script>
<template>
  <svg class="w-7 cursor-pointer" @click="handleSeatClick()" id="Layer_1" data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 25 24.999">
    <defs>
      <clipPath id="clip-path">
        <path class="cls-1"
          d="M12.5,25h0A12.5,12.5,0,0,1,0,12.5V2.218A2.219,2.219,0,0,1,2.218,0H22.781A2.219,2.219,0,0,1,25,2.218V12.5A12.5,12.5,0,0,1,12.5,25Z" />
      </clipPath>
      <linearGradient id="linear-gradient" x1="12.5" y1="0.995" x2="12.5" y2="17.785" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-opacity="0" />
        <stop offset="1" />
      </linearGradient>
    </defs>
    <g class="cls-2">
      <rect :fill="color" x="-5.165" y="-5.165" width="35.33" height="35.329" />
    </g>
    <path class="cls-4" d="M5.015,0h14.97a0,0,0,0,1,0,0V12.97a2,2,0,0,1-2,2H7.015a2,2,0,0,1-2-2V0A0,0,0,0,1,5.015,0Z" />
  </svg>
</template>
<style scoped>
.cls-1 {
  fill: none;
  clip-rule: evenodd;
}

.cls-2 {
  clip-path: url(#clip-path);
}

.cls-4 {
  opacity: 0.15;
  fill: url(#linear-gradient);
}
</style>
