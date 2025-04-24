<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[32px] font-semibold text-[rgba(4,13,37,1)] leading-10">
        Criar nova senha
      </h1>
      <div class="text-sm font-normal text-[rgba(34,42,63,1)] leading-[18px]">
        Digite os dados abaixo corretamente
      </div>

      <form @submit.prevent="handleSubmit" class="w-full">
        <div class="mb-6">
          <label class="block text-sm font-medium text-[rgba(34,42,63,1)] mb-2">
            Senha <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-3 text-gray-400"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-[rgba(34,42,63,1)] mb-2">
            Confirmar senha <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-3 text-gray-400"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Processando...' : 'Redefinir' }}
        </button>

        <div class="mt-4 text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-700">
            Lembrou sua senha? Clique aqui
          </router-link>
        </div>
      </form>
    </div>

    <ForgotPasswordBackground />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ForgotPasswordBackground from '@/components/layout/login/ForgotPasswordBackground.vue'

const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const isFormValid = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true
    // Aqui você implementará a lógica de redefinição de senha
    // const token = route.query.token as string
    // await authStore.resetPassword(token, password.value)
    // Após a redefinição bem-sucedida, você pode redirecionar ou mostrar uma mensagem
    router.push('/password-changed')
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
  } finally {
    loading.value = false
  }
}
</script> 