<script setup>
import { ref } from 'vue';

const props = defineProps({
  onSubmit: {
    type:Function,
    default: () => {console.log("On submit wasn't provided.")}
  },
  type: {
    type: String,
    default: "Unknown"
  }
})

const email = ref('');
const password = ref('');

</script>
<template>
  <q-card class="q-pa-sm">
    <q-card-section class="column flex-center">
      <div class="flex full-width">
        <p class="title">{{ type }}</p>
      </div>
      <form class="form" @submit.prevent="onSubmit(email, password)">
        <div class="inner" style="min-width: 300px">
          <q-input v-model="email" label="Email" filled />
          <q-input v-model="password" label="Password" filled />
        </div>
        <q-btn class="bg-primary" type="submit" label="submit" />
      </form>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.title {
  font-size: 180%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form > .inner {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
