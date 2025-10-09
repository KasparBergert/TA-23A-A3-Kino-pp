<script setup>
import Form from './Form.vue'
import client from '../../../utils/api.ts'
import { useQuasar } from 'quasar'

const $q = useQuasar()

async function onSubmit(email, password) {
  try {
    await client.post('/auth/users/login', {
      email,
      password,
    })
  } catch (err) {
    $q.notify({
      message: err.response.data.message,
      type: 'negative',
    })
  }
}
</script>

<template>
  <Form :onSubmit="onSubmit" type="Login" />
</template>
