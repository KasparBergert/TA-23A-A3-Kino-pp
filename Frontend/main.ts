import { createApp } from 'vue'
import { createPinia } from "pinia"
import App from './src/App.vue'
import router from './src/router'
import './src/assets/styles/main.css'
import './src/assets/styles/base.css'

const pinia = createPinia();
const app = createApp(App)

app.use(pinia)
app.use(router).mount('#app')

