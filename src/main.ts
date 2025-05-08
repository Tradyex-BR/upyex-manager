import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { fpjsPlugin } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

import './style.css'
import './plugins/fontawesome'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true
})

if (import.meta.env.DEV) {
  // Mock do Fingerprint.js Pro em desenvolvimento
  app.provide('fingerprint', {
    getData: async () => ({
      visitorId: 'Qg0JCu3FzrLMH3tPTWIP'
    })
  })
} else {
  app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY
    }
  })
}

app.mount('#app')
