<script setup lang="ts">
import { ref } from 'vue'
import client from '../../utils/api.ts'
import { close } from '../../utils/modal.ts'
import Form from '../../components/Form.vue'
import { Toaster, toast } from "@steveyuowo/vue-hot-toast";

const email = ref('')
const password = ref('')

async function submitForm() {
  try {
    //fails when request is anything other than response 2xx.
    await client.post('/auth/users/register', {
      email: email.value,
      password: password.value,
    })

    toast.success('Registration successful. Try loggin in!')
    close();
  } catch (err) {
    toast.error(err.response.data.message)
  }

}
</script>

<!-- @ts-expect-error Vue slot typing bug -->
<template>
  <Toaster />
  <div class="form-login">
    <h2 class="form-title">Register</h2>
    <Form :onSubmit="submitForm">
      <template #inputs>
        <div class="form-inputs">
          <div class="form-field">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="email" type="email" required placeholder="you@example.com" class="form-input" />
          </div>

          <div class="form-field">
            <label for="password" class="form-label">Password</label>
            <input id="password" v-model="password" type="password" required placeholder="••••••••"
              class="form-input" />
          </div>
        </div>
      </template>

      <template #actions>
        <button type="submit" class="btn-primary outlined">Register</button>
      </template>

    </Form>
  </div>
</template>

<style scoped>
.form-login {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-title {
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  color: #000000;
  margin-bottom: 0.25rem;
}

.form-input {
  border: 1px solid #00000085;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  color: black;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 15px;
}
</style>
