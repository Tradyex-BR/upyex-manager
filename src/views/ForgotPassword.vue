<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
        Esqueceu a senha
      </h1>
      <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
        Insira o endereço de e-mail vinculado à sua conta e enviaremos um link para redefinir sua senha.
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span class="text-[#040D25] text-[14px] font-medium leading-5">Email</span>
            <span class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
          </label>
          <div class="h-[56px] flex items-center border gap-2 px-3 py-4 rounded-lg border-solid border-[#B8B8B8]">
            <div>
              <div v-html="emailIcon"></div>
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Digite seu email"
              class="flex-1 bg-transparent outline-none font-inter text-[#222A3F] leading-5"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
          <div>
            <button
              type="submit"
              class="bg-[#CF631C] rounded py-2 px-4 group relative w-full flex justify-center text-[#F7F7F8] font-inter text-[14px] leading-6 font-bold hover:border-[#CF631C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
              <span v-else>Redefinir</span>
            </button>
          </div>
          <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
            <span>Lembrou sua senha? </span>
            <router-link to="/login" class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
              Faça login
            </router-link>
          </div>
        </div>
      </form>
    </div>

    <ForgotPasswordBackground />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ForgotPasswordBackground from '@/components/layout/login/ForgotPasswordBackground.vue'

const router = useRouter()
const email = ref('')
const loading = ref(false)

const emailIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.374 12.718L19.88 9.663C20.581 9.189 21 8.398 21 7.552V7.552C21 6.142 19.858 5 18.449 5H5.56601C4.15701 5 3.01501 6.142 3.01501 7.551V7.551C3.01501 8.397 3.43401 9.188 4.13501 9.663L8.64101 12.718C10.674 14.096 13.341 14.096 15.374 12.718V12.718Z" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 7.55103V17C3 18.657 4.343 20 6 20H18C19.657 20 21 18.657 21 17V7.55203" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const handleSubmit = async () => {
  try {
    loading.value = true
    // Aqui você implementará a lógica de recuperação de senha
    // await authStore.forgotPassword(email.value)
    // Após o envio bem-sucedido, você pode redirecionar ou mostrar uma mensagem
    router.push('/email-sent')
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
  } finally {
    loading.value = false
  }
}
</script> 