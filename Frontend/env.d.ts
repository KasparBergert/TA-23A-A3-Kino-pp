//import pulls in Vite’s environment type definitions
/// <reference types="vite/client" />

//Whenever you see `import x from './something.vue'`, treat it as a Vue component
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
