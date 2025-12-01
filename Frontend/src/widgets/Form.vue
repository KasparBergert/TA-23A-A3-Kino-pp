<script setup lang="ts">

const props = defineProps<{
  onSubmit: Function
}>()

const slots = defineSlots<{
  inputs?: () => any
  actions?: () => any
}>()

</script>

<template>
  <form @submit.prevent="props.onSubmit()" class="form">
    <slot name="inputs"></slot>
    <slot name="actions"></slot>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap:1.5em;
}
</style>
