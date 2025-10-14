<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useModal } from '../stores/modal'

// --- Singleton guard (module-scope flag)
let modalMounted = false

onMounted(() => {
  if (modalMounted) {
    console.error(
      '<Modal/> reuse detected. This modal is a singleton — use open() and close() from stores/modal.ts.'
    )
  } else {
    modalMounted = true
  }
})

onUnmounted(() => {
  modalMounted = false
})

// --- Reactive modal state
const { isActive, view, close } = useModal()
</script>

<template>
  <div class="background" v-show="isActive">
    <div class="modal">
      <div class="modal-head">
        <span class="close" @click="close">✕</span>
      </div>

      <div class="modal-content">
        <component :is="view" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.671);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  border-radius: 1.5em;
  color: white;
  min-width: 320px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.modal-head {
  display: flex;
  justify-content: flex-end;
}

.close {
  color:black;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  user-select: none;
  transition: all 0.2s;
}

.close:hover {
  color: #ff5252;
}

.modal-content {
  margin-top: 0.5rem;
}
</style>
