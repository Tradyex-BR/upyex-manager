<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="z-[100] flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
        Criar nova senha
      </h1>
      <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
        Digite os dados abaixo corretamente
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span class="text-[#040D25] text-[14px] font-medium leading-5">Senha</span>
            <span class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
          </label>
          <div class="h-[56px] flex items-center border gap-2 px-3 py-4 rounded-lg border-solid border-[#B8B8B8]">
            <div>
              <div v-html="passwordIcon"></div>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="flex-1 bg-transparent outline-none font-inter text-[#222A3F] leading-5"
              required
              :disabled="loading"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="p-0 bg-transparent border-none outline-none transition-all duration-300 hover:bg-[#b8b8b82f]"
            >
              <div v-html="eyeIcon"></div>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span class="text-[#040D25] text-[14px] font-medium leading-5">Confirmar senha</span>
            <span class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
          </label>
          <div class="h-[56px] flex items-center border gap-2 px-3 py-4 rounded-lg border-solid border-[#B8B8B8]">
            <div>
              <div v-html="passwordIcon"></div>
            </div>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="flex-1 bg-transparent outline-none font-inter text-[#222A3F] leading-5"
              required
              :disabled="loading"
            />
            <button 
              type="button" 
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              class="p-0 bg-transparent border-none outline-none transition-all duration-300 hover:bg-[#b8b8b82f]"
            >
              <div v-html="eyeIcon"></div>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
          <div>
            <button
              type="submit"
              class="bg-[#CF631C] rounded py-2 px-4 group relative w-full flex justify-center text-[#F7F7F8] font-inter text-[14px] leading-6 font-bold hover:border-[#CF631C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
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

    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const passwordIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M13 3H14C15.105 3 16 3.895 16 5C16 3.895 16.895 3 18 3H19" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 19V5" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 13L11 11" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 11L11 13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.57996 13L6.57996 11" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.57996 11L6.57996 13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 21H18C16.895 21 16 20.105 16 19C16 20.105 15.105 21 14 21H13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 17H5C3.895 17 3 16.105 3 15V9C3 7.895 3.895 7 5 7H13" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 17H19C20.105 17 21 16.105 21 15V9C21 7.895 20.105 7 19 7H16" stroke="#85B1FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 18.9999C11.158 18.9999 10.315 18.8219 9.49597 18.5049" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.882 12.468C18.99 15.967 15.495 19 12 19" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M19.079 8.9209C19.77 9.7299 20.384 10.6119 20.882 11.5329C21.039 11.8239 21.039 12.1769 20.882 12.4679" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 19L19 5" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.77302 14.2271C8.54302 12.9971 8.54302 11.0021 9.77302 9.77211C11.003 8.54211 12.998 8.54211 14.228 9.77211" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.044 6.956C15.497 5.759 13.748 5 12 5C8.50499 5 5.00999 8.033 3.11799 11.533C2.96099 11.824 2.96099 12.177 3.11799 12.468C4.06399 14.217 5.40999 15.849 6.95599 17.045" stroke="#B8B8B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

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