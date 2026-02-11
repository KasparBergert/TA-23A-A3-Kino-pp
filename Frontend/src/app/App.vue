<script setup>
import { RouterView } from 'vue-router'
import TheModal from '../widgets/TheModal.vue';
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { Toaster } from "@steveyuowo/vue-hot-toast";
import { onMounted } from 'vue';
import authStore from '../store/AuthStore';

onMounted(() => {
  authStore.loadUser()
})
</script>

<template>
  <Toaster />
  <TheModal/>
  <RouterView />
</template>
