<script setup>
import { ref } from 'vue'
import Form from './Form.vue'
import client from '../../../utils/api'

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')

async function onSubmit(email, password) {
  try {
    const result = await client.post('/auth/users/register', {
      email,
      password,
    })
    snackbarMessage.value = result.data.message
    snackbarColor.value = 'success'
    snackbar.value = true
  } catch (err) {
    snackbarMessage.value = err.response?.data?.message || 'Registration failed'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
</script>

<template>
  <Form :onSubmit="onSubmit" type="Register" />

  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="3000"
    location="bottom"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>
