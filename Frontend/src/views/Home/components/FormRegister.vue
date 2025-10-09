<script setup>
import Form from './Form.vue';
import { useQuasar } from 'quasar';
import client from '../../../utils/api';


const $q = useQuasar();

async function onSubmit(email, password) {
  try {
    const result = await client.post('/auth/users/register', {
      email,
      password,
    })

    $q.notify({
      message: result.data.message,
      type: 'positive',
    })

  } catch (err) {
    $q.notify({
      message: err.response?.data?.message,
      type: 'negative',
    })
  }
}

</script>
<template>
  <Form :onSubmit="onSubmit" type="Register"/>
</template>
