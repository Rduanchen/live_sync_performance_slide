import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#09090D',
          'on-background': '#F6F5F2',
          surface: '#192E50',
          'on-surface': '#F6F5F2',
          outline: '#45454B',
          primary: '#FFD66B',
          'on-primary': '#09090D',
          secondary: '#FFD66B',
          'on-secondary': '#09090D',
          accent: '#762F35',
          'on-accent': '#F6F5F2',
        }
      }
    }
  }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
