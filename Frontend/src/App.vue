<script setup>
import { RouterView } from 'vue-router'
import TheModal from "./components/TheModal.vue"
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
</script>

<template>
  <TheModal/>
  <RouterView />
</template>
