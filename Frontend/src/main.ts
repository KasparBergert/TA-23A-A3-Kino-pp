import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles' // it does find them
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//icons
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#E50914', // Netflix Red
          accent: '#B20710', // Symbol Dark Red
          secondary: '#000000', // black
          dark: '#121212', // near darkest
          info: '#B20710', // reuse dark red or variant
          warning: '#FFA500', // warm amber (film accent)
          positive: '#FFFFFF', // for success (white text maybe)
          negative: '#E50914', // error in red
          background: '#0d0d0d',
          surface: '#1a1a1a',
          onPrimary: '#fff',
          onSecondary: '#fff',
          border: '#333333',
        },
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
