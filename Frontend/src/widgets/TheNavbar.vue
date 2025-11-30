<script setup lang="ts">
import { open } from "../utils/modal";
import FormLogin from "../features/auth/FormLogin.vue";
import FormRegister from "../features/auth/FormRegister.vue";

</script>
<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-left">
      <span class="navbar-title">HanKas Cinema</span>
    </div>
    <div class="navbar-right">
      <button @click="open(FormLogin)" class="nav-btn">Login</button>
      <button @click="open(FormRegister)" class="nav-btn">Register</button>
    </div>
  </nav>
</template>

<style scoped>
/* Layout */
.navbar {
  background: rgba(8, 25, 179, 0.301);
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color:white;
}

.navbar-right {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  color:white;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
}
.nav-btn:hover {
  color: #269af8;
}
</style>
