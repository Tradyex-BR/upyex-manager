<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div
      class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">

      <div class="flex flex-col gap-2">
        <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
          Esqueceu a senha
        </h1>
        <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
          Insira o endereço de e-mail vinculado à sua conta e enviaremos um link para redefinir sua senha.
        </div>
      </div>

      <form class="flex flex-col gap-4 w-full" @submit.prevent="handleSubmit">
        <BaseInput v-model="email" label="Email" type="email" placeholder="Digite seu email" required
          :disabled="loading">
          <template #prefix>
            <div v-html="emailIcon"></div>
          </template>
        </BaseInput>
      </form>

      <div class="flex flex-col gap-6 w-full max-sm:items-center">
        <div>
          <BaseButton type="submit" variant="primary" :loading="loading" :disabled="!isEmailValid"
            class="w-full h-[40px]" @click="handleSubmit">
            {{ loading ? 'Enviando...' : 'Redefinir' }}
          </BaseButton>
        </div>

        <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <span>Lembrou sua senha? </span>
          <router-link :to="route.meta.role === 'MANAGER' ? '/login/manager' : '/login/affiliate'"
            class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { CONTEXT_ROLE_KEY, API_BASE_URL } from '@/config/constants'

const router = useRouter()
const route = useRoute()
const email = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Carregar o email salvo
onMounted(() => {
  const savedEmail = window.localStorage.getItem('recoveryEmail')
  if (savedEmail) {
    email.value = savedEmail
  }
  // Salva o papel do usuário no store
  if (route.meta.role) {
    localStorage.setItem(CONTEXT_ROLE_KEY, route.meta.role as 'manager' | 'affiliate')
  }
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
    const endpoint = localStorage.getItem(CONTEXT_ROLE_KEY) === 'manager' ? '/manager/auth/password/forgot' : '/affiliate/auth/password/forgot'
    const url = `${API_BASE_URL}${endpoint}?email=${encodeURIComponent(email.value.trim())}`
    const res = await fetch(url, {
      method: 'GET'
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao solicitar recuperação de senha')
    }
    message.value = data.message || 'Email enviado com instruções para redefinir a senha.'
    setTimeout(() => router.push(`/email-sent/${localStorage.getItem(CONTEXT_ROLE_KEY)?.toLowerCase()}`), 1200)
  } catch (err: any) {
    error.value = err.message || 'Erro ao solicitar recuperação de senha'
  } finally {
    loading.value = false
  }
}
</script>