import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/manager': {
        target: 'https://api.manager.upyex.com',
        changeOrigin: true,
        secure: true,
      },
      '/affiliate': {
        target: 'https://api.manager.upyex.com',
        changeOrigin: true,
        secure: true,
      },
      '/external': {
        target: 'https://api.manager.upyex.com',
        changeOrigin: true,
        secure: true,
      },
    }
  }
})
