<script setup lang="ts">
import { ref } from "vue"
import orderStore from "../store/OrderStore"

const cardNumber = ref("")
const expiry = ref("")
const cvc = ref("")
const amount = ref()

  function submitPayment() {
    const paymentData = {
      cardNumber: cardNumber.value,
      expiry: expiry.value,
      cvc: cvc.value,
      amount,
    }

    console.log("Payment submitted:", paymentData)
    //check if user has set email
    // send chosen seats
    orderStore.getChosenSeats()
  }

</script>
<template>
  <main
    class="relative flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 py-10 px-4 sm:px-6">
    <BackgroundGlow />

    <div class="relative z-10 w-full max-w-md">
      <form @submit.prevent="submitPayment"
        class="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-5">
        <h2 class="text-xl font-semibold text-gray-100">
          Payment details
        </h2>

        <!-- Card number -->
        <div>
          <label class="block text-sm mb-1 text-gray-300">
            Card number
          </label>
          <input v-model="cardNumber" type="text" placeholder="1234 5678 9012 3456" required
            class="py-2.5 px-3 block w-full rounded-lg bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <!-- Expiry + CVC -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1 text-gray-300">
              Expiry
            </label>
            <input v-model="expiry" type="text" placeholder="MM/YY" required
              class="py-2.5 px-3 block w-full rounded-lg bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block text-sm mb-1 text-gray-300">
              CVC
            </label>
            <input v-model="cvc" type="text" placeholder="123" required
              class="py-2.5 px-3 block w-full rounded-lg bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm mb-1 text-gray-300">
            Amount
          </label>
          <h3>{{ amount }}</h3>
        </div>

        <!-- Submit -->
        <button type="submit"
          class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Pay
        </button>
      </form>
    </div>
  </main>
</template>
