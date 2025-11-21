import { createApp } from 'vue'
import App from './src/App.vue'
import router from './src/router'
import './src/assets/styles/main.css'
import './src/assets/styles/base.css'
import 'preline'


const app = createApp(App)

app.use(router).mount('#app')
