<script setup lang="ts">
import { computed } from "vue";
import formatUnixTimeToHHMM from "../utils/formatUnixTimeToHHMM";
import type ShowtimeType from "../types/ShowtimeType";
import useTicketCreatorStore from "../stores/useTicketCreatorStore";
import { useRouter } from "vue-router";

const ticketCreator = useTicketCreatorStore();

const { showtime } = defineProps({
  showtime: {
    type: Object as () => ShowtimeType,
    required: true,
  },
});

const router = useRouter();

const available_percent = computed(() => {
  return showtime.hall.available_seats / (100 * showtime.hall.total_seats);
});

const showtime_time = {
  date: computed(() =>
    new Date(showtime.starts_at).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
    })
  ),
  starts: computed(() => formatUnixTimeToHHMM(showtime.starts_at)),
  ends: computed(() => formatUnixTimeToHHMM(showtime.ends_at)),
};

const handleChooseSeats = () => {
  //set the current showtime in the store
  ticketCreator.setCurrentShowtime(showtime);
  //navigate to choose seats page
  router.push({ name: "chooseSeat" });
};
</script>

<template>
  <div
    class="bg-slate-700 py-5 text-white flex items-center justify-center rounded-2xl gap-5 ring-1 ring-slate-600 my-4 px-3 shadow-lg"
  >
    <!-- Poster -->
    <img
      :src="showtime.film.poster_url"
      alt="Showtime Poster"
      class="w-80 rounded-3xl shadow-lg shadow-blue-400/20"
    />

    <!-- Showtime Info -->
    <div class="w-full max-w-md text-left text-lg">
      <div class="flex flex-col items-center justify-center max-w-md w-full">
        <div class="grid gap-2 bg-slate-800/50 p-6 rounded-2xl w-full">
          <p>
            <span class="font-semibold">Film:</span>
            {{ showtime.film.title }}
          </p>

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

          <!-- Availability Bar -->
          <div class="w-full bg-green-400 h-1 rounded-full overflow-hidden">
            <div
              class="h-1 bg-red-800 transition-all duration-700 ease-in-out border-r-2 border-red-600"
              :style="{ width: available_percent + '%' }"
            ></div>
          </div>
        </div>

        <!-- Choose Seats Button -->
        <button
          class="w-full mt-5 px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 select-none cursor-pointer"
          @click="handleChooseSeats()"
        >
          Choose Seats
        </button>
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
