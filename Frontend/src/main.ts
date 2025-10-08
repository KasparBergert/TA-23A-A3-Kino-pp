import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

createApp(App)
  .use(Quasar, {
    config: {
      dark: true,
      brand: {
        primary: '#a11212',
        secondary: '#0d0d0d',
        accent: '#ff3b3b',
        dark: '#1a0000',
        positive: '#00e676',
        negative: '#e53935',
        info: '#40c4ff',
        warning: '#ffb300',
      },
    },
  })
  .use(router)
  .mount('#app')
