import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    base: mode === 'production' ? 'https://manager.upyex.com' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 3000,
      allowedHosts: ['manager.upyex.com'],
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
  }
})
