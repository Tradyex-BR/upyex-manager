<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">
      <PaperPlaneIcon class="self-center" />
      
      <div class="flex flex-col gap-2">
        <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
          Enviamos um email para você
        </h1>
        <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
          Enviamos para seu email cadastrado uma mensagem de redefinição. Caso não encontre, por favor, procurar na caixa
          de SPAM
        </div>
      </div>

      <form class="flex flex-col gap-4 w-full" @submit.prevent="handleBack">
        <div class="flex flex-col gap-6 w-full max-sm:items-center">
          <div>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
              class="w-full"
              @click="handleBack">
              {{ loading ? 'Enviando...' : 'Voltar' }}
            </BaseButton>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import PaperPlaneIcon from '@/components/icons/PaperPlaneIcon.vue'
const router = useRouter()

const loading = ref(false)

const handleBack = async () => {
  try {
    loading.value = true
    // Aqui você implementará a lógica de reenvio do email de recuperação
    // await authStore.resendForgotPasswordEmail(email.value)
    // Após o envio bem-sucedido, você pode redirecionar ou mostrar uma mensagem
    router.push('/forgot-password')
  } catch (error) {
    console.error('Erro ao solicitar reenvio do email:', error)
  } finally {
    loading.value = false
  }
}
</script>