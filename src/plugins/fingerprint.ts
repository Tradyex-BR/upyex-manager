import { ref } from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import { logger } from '@/config/logger'

const visitorId = ref<string>('')
const isFingerprintLoading = ref(true)
const error = ref<string>('')

export const useFingerprint = () => {
  const get = async () => {
    try {
      logger.info('Iniciando obtenção do fingerprint...')
      const fp = await FingerprintJS.load({
        apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY,
        endpoint: 'https://fpjs.io',
        scriptUrlPattern: 'https://fpjs.io/agent?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>'
      })

      const result = await fp.get()
      logger.info('Fingerprint obtido:', result)
      visitorId.value = result.visitorId
      return result
    } catch (err) {
      logger.error('Erro ao obter fingerprint:', err)
      error.value = 'Erro ao obter fingerprint'
      throw err
    } finally {
      isFingerprintLoading.value = false
    }
  }

  return {
    visitorId,
    isFingerprintLoading,
    error,
    get
  }
} 