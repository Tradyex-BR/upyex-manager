<template>
  <form class="flex flex-col gap-4 w-full" @submit.prevent="handleLogin">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <BaseInput v-model="email" label="Email" type="email" placeholder="Digite seu email" required
          :error="emailError" :disabled="loading || isFingerprintLoading">
          <template #prefix>
            <EmailIcon />
          </template>
        </BaseInput>

        <BaseInput v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'"
          placeholder="Digite sua senha" autocomplete=required :disabled="loading || isFingerprintLoading">
          <template #prefix>
            <PasswordIcon />
          </template>
          <template #suffix>
            <PasswordVisibilityIcon :is-visible="showPassword" @toggle="showPassword = !showPassword" />
          </template>
        </BaseInput>
      </div>

      <div class="flex flex-col gap-4">
        <BaseButton type="submit" variant="primary" class="h-[40px]" :disabled="!isFormValid"
          :loading="loading || isFingerprintLoading">
          {{ isFingerprintLoading ? 'Carregando...' : 'Entrar' }}
        </BaseButton>

        <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <div class="relative inline-block group">
            <router-link :to="isEmailValid ? forgotPasswordRoute : '#'" :class="[
              isEmailValid
                ? 'text-[#CF631C] hover:underline hover:text-[#CF631C]'
                : 'text-[#444c5a] opacity-50 cursor-not-allowed pointer-events-none'
            ]" @click="handleForgotPassword">
              Esqueci minha senha
            </router-link>
            <div v-if="!isEmailValid"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#222A3F] text-white text-xs rounded-lg whitespace-nowrap invisible group-hover:visible transition-all duration-200 pointer-events-none z-50"
              style="width: max-content;">
              Digite um email válido primeiro
              <div
                class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#222A3F]">
              </div>
            </div>
          </div>
        </div>
<!--         <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
 -->      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import EmailIcon from '@/components/common/icons/EmailIcon.vue'
import PasswordIcon from '@/components/common/icons/PasswordIcon.vue'
import PasswordVisibilityIcon from '@/components/common/icons/PasswordVisibilityIcon.vue'
import { notificationService } from '@/services/notificationService'
import { CONTEXT_ROLE_KEY } from '@/config/constants'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const loading = ref(false)
const error = ref('')

const role = computed(() => localStorage.getItem(CONTEXT_ROLE_KEY) as 'manager' | 'affiliate')

const isDev = import.meta.env.DEV
const mockFingerprint = isDev ? inject('fingerprint') as { getData: () => Promise<{ visitorId: string }> } : null
const { data: visitorData, isLoading: isFingerprintLoading, getData: getFingerprint } = !isDev ? useVisitorData(
  { extendedResult: true },
  { immediate: true }
) : { data: ref(null), isLoading: ref(false), getData: async () => { } }

const visitorId = ref('')

const isEmailValid = computed(() => {
  if (!email.value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

watch(email, (newValue) => {
  if (!newValue) {
    emailError.value = ''
    return
  }
  if (!isEmailValid.value) {
    emailError.value = 'Digite um email válido'
  } else {
    emailError.value = ''
  }
})

const isFormValid = computed(() => {
  const valid = isEmailValid.value && password.value.length > 0 && !isFingerprintLoading.value && visitorId.value !== ''
  return valid
})

const forgotPasswordRoute = computed(() => {
  return role.value === 'manager' ? '/forgot-password/manager' : '/forgot-password/affiliate'
})

const handleForgotPassword = () => {
  if (isEmailValid.value) {
    window.localStorage.setItem('recoveryEmail', email.value)
  }
}

const authStore = useAuthStore()

onMounted(async () => {
  console.log('Iniciando obtenção do fingerprint...')
  try {
    if (isDev) {
      console.log('Ambiente de desenvolvimento: usando mock do fingerprint')
      const mockData = await mockFingerprint?.getData()
      console.log('Dados do mock:', mockData)
      if (mockData) {
        visitorId.value = mockData.visitorId
      }
    } else {
      console.log('Obtendo dados do visitante...')
      await getFingerprint({ ignoreCache: true })
      console.log('Dados do visitante obtidos:', visitorData.value)
      if (visitorData.value) {
        visitorId.value = visitorData.value.visitorId
      }
    }
  } catch (error: any) {
    console.error('Erro ao obter fingerprint:', error)
    error.value = 'Não foi possível obter o identificador do dispositivo. Por favor, desative temporariamente seu bloqueador de anúncios e tente novamente.'
  } finally {
    isFingerprintLoading.value = false
  }
})

const handleLogin = async () => {
  if (!visitorId.value) {
    error.value = 'Erro ao obter identificador do dispositivo. Por favor, tente novamente.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      fingerprint: visitorId.value
    })
    router.push('/dashboard')
  } catch (err: any) {
    if (err.response?.data?.message && err.response.data.message.toLowerCase().includes('senha')) {
      error.value = 'Você precisa definir uma senha antes do primeiro acesso. Clique em "Esqueci minha senha" para criar sua senha.'
    } else {
      error.value = err.response?.data?.message || 'Erro ao autenticar'
      notificationService.error(error.value)
    }
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.chevron-icon {
  transition: transform 0.2s ease-in-out;
}

.chevron-icon.open {
  transform: rotate(180deg);
}
</style>
