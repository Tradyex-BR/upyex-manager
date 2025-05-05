<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">

      <div class="flex flex-col gap-2">
        <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
          Esqueceu a senha
        </h1>
        <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
          Insira o endereço de e-mail vinculado à sua conta e enviaremos um link para redefinir sua senha.
        </div>
      </div>

      <form class="flex flex-col gap-4 w-full" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
          required
          :disabled="loading"
        >
          <template #prefix>
            <div v-html="emailIcon"></div>
          </template>
        </BaseInput>
        
        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span class="text-[#040D25] text-[14px] font-medium leading-5">Tipo de usuário</span>
            <span class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
          </label>
          <BaseDropdown
            :options="roles.map(r => ({ text: r.label, action: r.value }))"
            :model-value="!!role"
            @select="role = $event"
            variant="light"
            :top="60"
          >
            <template #trigger>
              <div class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none bg-white flex items-center justify-between">
                <span class="font-inter text-[#222A3F] leading-5">{{ roles.find(r => r.value === role)?.label }}</span>
                <ChevronDownIcon class="w-5 h-5 text-[#222A3F]" />
              </div>
            </template>
          </BaseDropdown>
        </div>
      </form>

      <div class="flex flex-col gap-6 w-full max-sm:items-center">
        <div>
          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="!isEmailValid"
            class="w-full"
            @click="handleSubmit">
            {{ loading ? 'Enviando...' : 'Redefinir' }}
          </BaseButton>
        </div>

        <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <span>Lembrou sua senha? </span>
          <router-link to="/login" class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
            Faça login
          </router-link>
        </div>
      </div>
    </div>

    <!--     <div class="darker-gradient-background"></div>
 -->
    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import ChevronDownIcon from '@/components/common/icons/ChevronDownIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const router = useRouter()
const email = ref('')
const role = ref('MANAGER')
const roles = [
  { value: 'MANAGER', label: 'Administrador' },
  { value: 'AFFILIATE', label: 'Afiliado' }
]
const loading = ref(false)
const error = ref('')
const message = ref('')

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Carregar o último tipo de usuário selecionado e email
onMounted(() => {
  const savedRole = window.localStorage.getItem('userRole')
  if (savedRole) {
    role.value = savedRole
  }

  const savedEmail = window.localStorage.getItem('recoveryEmail')
  if (savedEmail) {
    email.value = savedEmail
  }
})

// Salvar o tipo de usuário no localStorage quando alterado
watch(role, (newRole) => {
  window.localStorage.setItem('userRole', newRole)
})

const emailIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.374 12.718L19.88 9.663C20.581 9.189 21 8.398 21 7.552V7.552C21 6.142 19.858 5 18.449 5H5.56601C4.15701 5 3.01501 6.142 3.01501 7.551V7.551C3.01501 8.397 3.43401 9.188 4.13501 9.663L8.64101 12.718C10.674 14.096 13.341 14.096 15.374 12.718V12.718Z" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 7.55103V17C3 18.657 4.343 20 6 20H18C19.657 20 21 18.657 21 17V7.55203" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const handleSubmit = async () => {
  if (!isEmailValid.value) {
    error.value = 'Por favor, insira um email válido'
    return
  }

  error.value = ''
  message.value = ''
  loading.value = true

  // Salvar o email no localStorage antes de fazer a requisição
  window.localStorage.setItem('recoveryEmail', email.value)

  try {
    let endpoint = ''
    if (role.value === 'MANAGER') {
      endpoint = '/manager/auth/password/forgot'
    } else if (role.value === 'AFFILIATE') {
      endpoint = '/affiliate/auth/password/forgot'
    }
    const url = `${import.meta.env.VITE_API_BASE_URL}${endpoint}?email=${encodeURIComponent(email.value.trim())}`
    const res = await fetch(url, {
      method: 'GET'
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao solicitar recuperação de senha')
    }
    message.value = data.message || 'Email enviado com instruções para redefinir a senha.'
    setTimeout(() => router.push('/email-sent'), 1200)
  } catch (err: any) {
    error.value = err.message || 'Erro ao solicitar recuperação de senha'
  } finally {
    loading.value = false
  }
}
</script>