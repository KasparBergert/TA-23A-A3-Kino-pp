import { ref, shallowRef } from 'vue'

let isActive = ref(false)
let view = shallowRef(null)

export function open(component: any){
  view.value = component
  isActive.value = true
}

export function close(){
  isActive.value = false
}

export function useModal(){
  return {isActive, view, open, close}
}
