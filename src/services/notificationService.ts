import { useToast, POSITION } from 'vue-toastification'
import { TOAST_CONFIG } from '@/config/constants'

const toast = useToast()

export const notificationService = {
  success: (message: string) => {
    toast.success(message, {
      ...TOAST_CONFIG,
      position: POSITION.BOTTOM_RIGHT
    })
  },

  error: (message: string) => {
    toast.error(message, {
      ...TOAST_CONFIG,
      position: POSITION.BOTTOM_RIGHT,
      timeout: 5000
    })
  },

  info: (message: string) => {
    toast.info(message, {
      ...TOAST_CONFIG,
      position: POSITION.TOP_RIGHT
    })
  },

  warning: (message: string) => {
    toast.warning(message, {
      ...TOAST_CONFIG,
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
  }
} 