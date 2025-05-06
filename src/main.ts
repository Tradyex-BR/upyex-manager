import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'

import App from './App.vue'
import router from './router'

import './style.css'
import './plugins/fontawesome'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(fpjsPlugin, {
  loadOptions: {
    apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY
  }
})

app.mount('#app')
