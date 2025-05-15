<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div
      class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">


      <div class="flex flex-col gap-2">
        <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
          Criar nova senha
        </h1>
        <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
          Digite os dados abaixo corretamente
        </div>
      </div>

      <form class="flex flex-col gap-4 w-full" @submit.prevent="handleSubmit">
        <BaseInput v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'"
          placeholder="Digite sua senha" autocomplete required :disabled="loading">
          <template #prefix>
            <div v-html="passwordIcon"></div>
          </template>
          <template #suffix>
            <PasswordVisibilityIcon :is-visible="showPassword" @toggle="showPassword = !showPassword" />
          </template>
        </BaseInput>

        <BaseInput v-model="confirmPassword" label="Confirmar senha" :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Digite sua senha" autocomplete required :disabled="loading">
          <template #prefix>
            <div v-html="passwordIcon"></div>
          </template>
          <template #suffix>
            <PasswordVisibilityIcon :is-visible="showConfirmPassword"
              @toggle="showConfirmPassword = !showConfirmPassword" />
          </template>
        </BaseInput>

        <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
          <div>
            <BaseButton type="submit" variant="primary" :loading="loading" class="w-full h-[40px]"
              :disabled="!isFormValid">
              {{ loading ? 'Processando...' : 'Redefinir' }}
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
      </form>
    </div>

    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import PasswordVisibilityIcon from '@/components/common/icons/PasswordVisibilityIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { CONTEXT_ROLE_KEY } from '@/config/constants'
import { logger } from '@/config/logger'

const router = useRouter()
const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

onMounted(() => {
  // Salva o papel do usuário no store
  if (route.meta.role) {
    localStorage.setItem(CONTEXT_ROLE_KEY, route.meta.role as 'manager' | 'affiliate')
  }
})

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

const isFormValid = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true

    // Aqui você implementará a lógica de redefinição de senha
    // await authStore.resetPassword(token, password.value)

    router.push('/password-changed')
  } catch (error) {
    logger.error('Erro ao redefinir senha:', error)
  } finally {
    loading.value = false
  }
}
</script>