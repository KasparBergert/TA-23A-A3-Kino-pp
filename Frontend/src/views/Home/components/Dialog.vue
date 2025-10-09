<script setup>
import { ref } from 'vue'

let view = ref(null) // controls what dialog shows in its content area

const localDialog = ref(false)
const maximized = ref(false)

function open() {
  localDialog.value = true
}

function close() {
  localDialog.value = false
}

/**
 *
 * @param component = raw Vue component used in the content of the dialog.
 */
function setView(component) {
  view = component
}

defineExpose({ open, close, setView })
</script>
<template>
  <q-dialog
    v-model="localDialog"
    persistent
    transition-show="fade"
    transition-hide="fade"
    transition-duration="233"
  >
    <div class="column flex">
      <q-bar class="bg-primary">
        <div class="q-py-lg">
          <q-btn flat label="X" v-close-popup />
        </div>
      </q-bar>
      <component :is="view" />
    </div>
  </q-dialog>
</template>
