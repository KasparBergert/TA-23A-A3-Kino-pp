<script setup>
import { ref } from "vue";

const props = defineProps({
  onSubmit: {
    type: Function,
    default: () => console.log("On submit wasn't provided."),
  },
  type: {
    type: String,
    default: "Unknown",
  },
});

const email = ref("");
const password = ref("");
</script>

<template>
  <div>
    <div class="w-100 mb-4">
      <p class="text-h5 text-center">{{ type }}</p>
    </div>
    <form class="w-100" @submit.prevent="onSubmit(email, password)">
      <div class="d-flex flex-column gap-4">
        <v-text-field v-model="email" label="Email" variant="filled" />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="filled"
        />
      </div>
      <v-btn class="mt-4 bg-accent" color="primary" type="submit">Submit</v-btn>
    </form>
  </div>
</template>

<style scoped>
.gap-4 {
  gap: 20px;
}
</style>
