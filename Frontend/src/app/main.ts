import { createApp } from 'vue'
import App from './App.vue'
import router from '../router'
import './base.css'
import './main.css'
import 'preline'
const app = createApp(App)

app.use(router).mount('#app')
