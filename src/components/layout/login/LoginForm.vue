<template>
  <form class="flex flex-col gap-4 w-full" @submit.prevent="handleLogin">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <BaseInput v-model="email" label="Email" type="email" placeholder="Digite seu email" required
          :error="emailError" :disabled="loading">
          <template #prefix>
            <EmailIcon />
          </template>
        </BaseInput>

        <BaseInput v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'"
          placeholder="Digite sua senha" required :disabled="loading">
          <template #prefix>
            <PasswordIcon />
          </template>
          <template #suffix>
            <PasswordVisibilityIcon :is-visible="showPassword" @toggle="showPassword = !showPassword" />
          </template>
        </BaseInput>

        <div class="flex flex-col gap-1">
          <label class="text-[14px] font-medium">Tipo de usuário <span class="text-[#BE3E37]">*</span></label>
          <BaseDropdown :options="roles.map(r => ({ text: r.label, action: r.value }))" :model-value="!!role"
            @select="role = $event" variant="light" :top="60">
            <template #trigger>
              <div
                class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none bg-white flex items-center justify-between">
                <span class="font-inter text-[#222A3F] leading-5">{{roles.find(r => r.value === role)?.label}}</span>
                <ChevronDownIcon class="w-5 h-5 text-[#222A3F]" />
              </div>
            </template>
          </BaseDropdown>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <BaseButton type="submit" variant="primary" class="h-[40px]" :disabled="!isFormValid" :loading="loading">
          Entrar
        </BaseButton>

        <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <div class="relative inline-block group">
            <router-link :to="isEmailValid ? '/forgot-password' : '#'" :class="[
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
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import EmailIcon from '@/components/common/icons/EmailIcon.vue'
import PasswordIcon from '@/components/common/icons/PasswordIcon.vue'
import PasswordVisibilityIcon from '@/components/common/icons/PasswordVisibilityIcon.vue'
import ChevronDownIcon from '@/components/common/icons/ChevronDownIcon.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const roles = [
  { value: 'MANAGER', label: 'Administrador' },
  { value: 'AFFILIATE', label: 'Afiliado' }
]
const role = ref<'MANAGER' | 'AFFILIATE'>('MANAGER')
const loading = ref(false)
const error = ref('')

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
  return isEmailValid.value && password.value.length > 0
})

const handleForgotPassword = () => {
  if (isEmailValid.value) {
    window.localStorage.setItem('recoveryEmail', email.value)
  }
}

const authStore = useAuthStore()

// Carregar o último tipo de usuário selecionado
onMounted(() => {
  const savedRole = localStorage.getItem('userRole')

  if (savedRole) {
    role.value = savedRole as 'MANAGER' | 'AFFILIATE'
  }

  if (!savedRole) {
    localStorage.setItem('userRole', role.value)
  }

})

// Salvar o tipo de usuário no localStorage quando alterado
watch(role, (newRole) => {
  localStorage.setItem('userRole', newRole)
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      role: role.value,
      fingerprint: 'Qg0JCu3FzrLMH3tPTWIP'
    })
    router.push('/dashboard')
  } catch (err: any) {
    if (err.response?.data?.message && err.response.data.message.toLowerCase().includes('senha')) {
      error.value = 'Você precisa definir uma senha antes do primeiro acesso. Clique em "Esqueci minha senha" para criar sua senha.'
    } else {
      error.value = err.response?.data?.message || 'Erro ao autenticar'
    }
  } finally {
    loading.value = false
  }
}

</script>
