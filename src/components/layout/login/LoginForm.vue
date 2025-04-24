<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-1 w-full">
      <!-- Indicador de ambiente de desenvolvimento -->
      <div v-if="isDev" class="mt-2 text-center text-sm text-gray-500">
          <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            Ambiente de Desenvolvimento
          </span>
          <div class="mt-2 text-xs text-gray-600">
            Use: usuario@teste.com / 123456
          </div>
        </div>

      <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
        <span>Email</span>
        <span class="text-[rgba(190,62,55,1)]">*</span>
      </label>
      <div class="flex items-center border gap-4 px-3 py-4 rounded-lg border-solid border-[rgba(184,184,184,1)]">
        <div>
          <div v-html="emailIcon"></div>
        </div>
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
        <div>
          <div v-html="passwordIcon"></div>
        </div>
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
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="rememberMe"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
          Lembrar-me
        </label>
      </div>
      <div class="text-sm">
        <router-link to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
          Esqueceu sua senha?
        </router-link>
      </div>
    </div>
    <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
      <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-primary-dark group-hover:text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
            <span v-else>Entrar</span>
          </button>
        </div>
      <div class="text-center text-sm font-normal text-[rgba(4,13,37,1)]">
        <span>Não possui conta? </span>
        <button type="button" class="text-[rgba(207,99,28,1)]">
          Cadastre-se
        </button>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const isDev = import.meta.env.DEV


const emailIcon = '<svg id="I1:1454;10:752" layer-name="Emails/Mail, Email, Letter" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="input-icon" style="width: 24px; height: 24px"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.3739 12.718L19.8799 9.663C20.5809 9.189 20.9999 8.398 20.9999 7.552V7.552C20.9999 6.142 19.8579 5 18.4489 5H5.56589C4.15689 5 3.01489 6.142 3.01489 7.551V7.551C3.01489 8.397 3.43389 9.188 4.13489 9.663L8.64089 12.718C10.6739 14.096 13.3409 14.096 15.3739 12.718V12.718Z" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 7.55078V16.9998C3 18.6568 4.343 19.9998 6 19.9998H18C19.657 19.9998 21 18.6568 21 16.9998V7.55178" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>'

const passwordIcon = '<svg id="I1:1455;10:752" layer-name="Interface, Essential/Input, Password, Protection" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="input-icon" style="width: 24px; height: 24px"> <path d="M13 3H14C15.105 3 16 3.895 16 5C16 3.895 16.895 3 18 3H19" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 19V5" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13 13L11 11" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13 11L11 13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.58008 13L6.58008 11" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.58008 11L6.58008 13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19 21H18C16.895 21 16 20.105 16 19C16 20.105 15.105 21 14 21H13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13 17H5C3.895 17 3 16.105 3 15V9C3 7.895 3.895 7 5 7H13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 17H19C20.105 17 21 16.105 21 15V9C21 7.895 20.105 7 19 7H16" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>'

const eyeIcon = '<svg id="I1:1455;10:760" layer-name="Interface, Essential/Eye, Hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon" style="width: 24px; height: 24px"> <path d="M12.0001 18.9999C11.1581 18.9999 10.3151 18.8219 9.49609 18.5049" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M20.882 12.4678C18.99 15.9668 15.495 18.9998 12 18.9998" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.0791 8.9209C19.7701 9.7299 20.3841 10.6119 20.8821 11.5329C21.0391 11.8239 21.0391 12.1769 20.8821 12.4679" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 19L19 5" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.77309 14.2271C8.54309 12.9971 8.54309 11.0021 9.77309 9.77211C11.0031 8.54211 12.9981 8.54211 14.2281 9.77211" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17.044 6.956C15.497 5.759 13.748 5 12 5C8.50499 5 5.00999 8.033 3.11799 11.533C2.96099 11.824 2.96099 12.177 3.11799 12.468C4.06399 14.217 5.40999 15.849 6.95599 17.045" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </svg>'

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ocorreu um erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>
