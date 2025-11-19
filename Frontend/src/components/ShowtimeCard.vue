<script setup lang="ts">
import { computed } from "vue";
import type ShowtimeType from "../types/ShowtimeType";
import { useRouter } from "vue-router";

const router = useRouter();

const { showtime } = defineProps<{
  showtime: ShowtimeType;
}>();

// Calculate % correctly
const availablePercent = computed(() => {
  const seats = showtime.hall.total_seats;
  const available = showtime.hall.available_seats;
  return Math.round((available / seats) * 100);
});

const starts = computed(() =>
  new Date(showtime.starts_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
);

const ends = computed(() =>
  new Date(showtime.ends_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
);

const date = computed(() =>
  new Date(showtime.starts_at).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  })
);

function chooseSeats() {

  router.push(`/showtime/${(showtime as any).id}`);
}
</script>

<template>
  <div
    class="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl
           dark:bg-gray-800 dark:border-gray-700 space-y-6"
  >
    <!-- Poster -->
    <img
      :src="showtime.film.poster_url"
      alt="Showtime Poster"
      class="w-full h-80 object-cover rounded-xl shadow"
    />

    <div class="space-y-3 text-gray-700 dark:text-gray-300">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        {{ showtime.film.title }}
      </h3>

      <p><span class="font-medium">Teater:</span> {{ showtime.theatre_name }}</p>

      <p>
        <span class="font-medium">Kuupäev:</span> {{ date }}<br />
        <span class="font-medium">Algus:</span> {{ starts }}<br />
        <span class="font-medium">Lõpp:</span> {{ ends }}
      </p>

      <p>
        <span class="font-medium">Vabu kohti:</span>
        {{ showtime.hall.available_seats }}
      </p>

      <!-- Progress bar -->
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span>Saadavus</span>
          <span>{{ availablePercent }}%</span>
        </div>

        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full transition-all duration-700"
            :style="{ width: availablePercent + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Choose seats button -->
    <button
      @click="chooseSeats"
      class="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl
             hover:bg-blue-700 transition hs-tooltip inline-flex justify-center"
    >
      Osta pilet
    </button>
  </div>
</template>
