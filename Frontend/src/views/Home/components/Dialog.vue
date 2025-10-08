<script setup>
import { ref } from 'vue'

const localDialog = ref(false)
const maximized = ref(true)

function open() {
  localDialog.value = true
}

function close() {
  localDialog.value = false
}

defineExpose({ open, close })
</script>
<template>
  <q-dialog
    v-model="localDialog"
    persistent
    :maximized="maximized"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary">
      <q-bar>
        <q-space />
        <q-btn label="1234"></q-btn>
        <q-btn label="close" @click="localDialog = false" />
      </q-bar>
      <q-card-section>
        <q-btn label="Button" />
      </q-card-section>

      <q-card-section>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam asperiores recusandae
        excepturi ipsum voluptatum perspiciatis similique sunt modi laboriosam debitis totam,
        doloribus exercitationem deleniti maxime dignissimos nobis eaque odit optio? Sed dolorum
        similique, tenetur quam veritatis sit ullam pariatur cupiditate delectus magnam.
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
