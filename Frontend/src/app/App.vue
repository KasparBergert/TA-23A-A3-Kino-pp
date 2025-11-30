<script setup>
import { RouterView } from 'vue-router'
import TheModal from '../widgets/TheModal.vue';
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
import { Toaster } from "@steveyuowo/vue-hot-toast";
</script>

<template>
  <Toaster />
  <TheModal/>
  <RouterView />
</template>
