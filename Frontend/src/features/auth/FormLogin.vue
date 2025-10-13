<script setup lang="ts">
import { ref } from 'vue'
import { close } from '../../stores/modal.ts'

const email = ref('')
const password = ref('')

function submitForm() {
  // Example: send login request (placeholder)
  console.log('Login submitted:', { email: email.value, password: password.value })

  // Normally you’d call an API here, then close the modal
  close()
}
</script>

<template>
  <div class="form-login">
    <h2 class="form-title">Login</h2>

    <form @submit.prevent="submitForm" class="form">
      <div class="form-field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Login</button>
        <button type="button" class="btn-secondary" @click="close">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-login {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #d1d5db;
}
</style>
