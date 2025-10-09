<script setup>
import { ref } from 'vue'

const view = ref(null)
const localDialog = ref(false)
const maximized = ref(false)

function open() {
  localDialog.value = true
}

function close() {
  localDialog.value = false
}

/**
 * @param component Raw Vue component to render inside dialog
 */
function setView(component) {
  view.value = component
}

defineExpose({ open, close, setView })
</script>

<template>
  <v-dialog
    v-model="localDialog"
    persistent
    transition="fade-transition"
    max-width="600"
  >
    <v-card>
      <v-card-title class="bg-accent d-flex justify-end">
        <v-btn icon="mdi-close" variant="text" @click="close">Close</v-btn>
      </v-card-title>
      <v-card-text>
        <component :is="view" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
