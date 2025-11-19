<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  is_available: boolean, //from DB
  is_selected: boolean // user click
}>()

if (!props.is_available && props.is_selected) {
  throw new Error("Seat is not available and is selected by user");
}

type SeatColor =
  | typeof available_color
  | typeof taken_color
  | typeof selected_color

const available_color = "#8027a1" as const;
const taken_color = "#db0028" as const;
const selected_color = "#1bbf0f" as const;
const currentColor = ref<SeatColor>(available_color);

watchEffect(() => {
  currentColor.value =
    props.is_selected
      ? selected_color
      : props.is_available
        ? available_color
        : taken_color
});

</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
    <defs>
      <clipPath id="clip-path">
        <path fill="none" clip-rule="evenodd"
          d="M12.5,25A12.5,12.5,0,0,1,0,12.5V2.218A2.219,2.219,0,0,1,2.218,0H22.781A2.219,2.219,0,0,1,25,2.218V12.5A12.5,12.5,0,0,1,12.5,25Z" />
      </clipPath>
      <linearGradient id="linear-gradient" x1="12.5" y1="1" x2="12.5" y2="17.785" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-opacity="0" />
        <stop offset="1" />
      </linearGradient>
    </defs>
    <title>seat</title>
    <g clip-path="url(#clip-path)">
      <rect x="-5.165" y="-5.165" width="35.33" height="35.329" :fill="currentColor" />
    </g>
    <path opacity="0.15" fill="url(#linear-gradient)" d="M5.015,0h14.97V12.97a2,2,0,0,1-2,2H7.015a2,2,0,0,1-2-2V0Z" />
  </svg>
</template>
