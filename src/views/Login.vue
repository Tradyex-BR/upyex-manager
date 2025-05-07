<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div
      class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">

      <div>
        <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
          Boas vindas ao TradyEx
        </h1>
        <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
          {{ route.meta.role === 'MANAGER' ? 'Área do Administrador' : 'Área do Afiliado' }}
        </div>
      </div>

      <!--  <SocialLogin /> -->

      <LoginForm />
    </div>

    <!--     <div class="darker-gradient-background"></div>
 -->
    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthContextStore } from '@/stores/auth-context'
import LoginForm from '@/components/layout/login/LoginForm.vue'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const authContextStore = useAuthContextStore()

onMounted(() => {
  // Se o usuário estiver autenticado, redireciona para o dashboard do contexto atual
  if (authStore.isAuthenticated) {
    router.replace(authContextStore.userRole === 'MANAGER' ? '/dashboard' : '/affiliate/dashboard')
    return
  }

  // Se a rota não tiver um papel definido, verifica o contexto salvo
  if (!route.meta.role) {
    if (authContextStore.userRole) {
      // Se tiver um contexto salvo, redireciona para a página de login correspondente
      router.replace(`/login/${authContextStore.userRole.toLowerCase()}`)
    } else {
      // Se não tiver contexto, redireciona para a rota de manager
      router.replace('/login/manager')
    }
  } else {
    // Salva o papel do usuário no store
    authContextStore.setUserRole(route.meta.role as 'MANAGER' | 'AFFILIATE')
  }
})
</script>

<style scoped>
.darker-gradient-background {
  position: absolute;
  height: 1031px;
  width: 100%;
  background: linear-gradient(to top, #010309 0%, #010309 10%, transparent 100%);
  z-index: 10;

}
</style>