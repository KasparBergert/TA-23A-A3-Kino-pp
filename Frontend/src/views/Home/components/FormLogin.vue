<script setup>
import { ref } from 'vue'
import Form from './Form.vue'
import client from '../../../utils/api.ts'

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')

async function onSubmit(email, password) {
  try {
    await client.post('/auth/users/login', {
      email,
      password,
    })
  } catch (err) {
    snackbarMessage.value = err.response?.data?.message || 'Login failed'
    snackbarColor.value = 'bg-accent'
    snackbar.value = true
  }
}
</script>

<template>
  <Form :onSubmit="onSubmit" type="Login" />

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="bottom"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>
