<template>
  <div class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[32px] font-semibold text-[rgba(4,13,37,1)] leading-10">
        Criar conta no TradyEx
      </h1>
      <div class="text-sm font-normal text-[rgba(34,42,63,1)] leading-[18px]">
        Preencha os dados abaixo para criar sua conta
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span>Nome</span>
            <span class="text-[rgba(190,62,55,1)]">*</span>
          </label>
          <div class="flex items-center border gap-4 px-3 py-4 rounded-lg border-solid border-[rgba(184,184,184,1)]">
            <input
              type="text"
              placeholder="Digite seu nome"
              v-model="name"
              class="flex-1 bg-transparent outline-none"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span>Email</span>
            <span class="text-[rgba(190,62,55,1)]">*</span>
          </label>
          <div class="flex items-center border gap-4 px-3 py-4 rounded-lg border-solid border-[rgba(184,184,184,1)]">
            <input
              type="email"
              placeholder="Digite seu email"
              v-model="email"
              class="flex-1 bg-transparent outline-none"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span>Senha</span>
            <span class="text-[rgba(190,62,55,1)]">*</span>
          </label>
          <div class="flex items-center border gap-4 px-3 py-4 rounded-lg border-solid border-[rgba(184,184,184,1)]">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              v-model="password"
              class="flex-1 bg-transparent outline-none"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <div v-html="eyeIcon"></div>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              </span>
              <span v-else>Criar conta</span>
            </button>
          </div>
          <div class="text-center text-sm font-normal text-[rgba(4,13,37,1)]">
            <span>Já possui conta? </span>
            <router-link to="/login" class="text-[rgba(207,99,28,1)] hover:underline">
              Faça login
            </router-link>
          </div>
        </div>

        <!-- Mensagem de erro -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>

    <LoginBackground />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const eyeIcon = '<svg id="I1:1455;10:760" layer-name="Interface, Essential/Eye, Hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon" style="width: 24px; height: 24px"> <path d="M12.0001 18.9999C11.1581 18.9999 10.3151 18.8219 9.49609 18.5049" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M20.882 12.4678C18.99 15.9668 15.495 18.9998 12 18.9998" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.0791 8.9209C19.7701 9.7299 20.3841 10.6119 20.8821 11.5329C21.0391 11.8239 21.0391 12.1769 20.8821 12.4679" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 19L19 5" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.77309 14.2271C8.54309 12.9971 8.54309 11.0021 9.77309 9.77211C11.0031 8.54211 12.9981 8.54211 14.2281 9.77211" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17.044 6.956C15.497 5.759 13.748 5 12 5C8.50499 5 5.00999 8.033 3.11799 11.533C2.96099 11.824 2.96099 12.177 3.11799 12.468C4.06399 14.217 5.40999 15.849 6.95599 17.045" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>'

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Aqui você implementará a lógica de cadastro
    // Por enquanto, vamos apenas simular um cadastro bem-sucedido
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Após o cadastro, redireciona para o login
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ocorreu um erro ao criar sua conta'
  } finally {
    loading.value = false
  }
}
</script> 