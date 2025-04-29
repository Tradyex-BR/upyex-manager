<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm"
  >
    <div class="flex z-[100] flex-col w-6/12 backdrop-blur-lg items-center gap-8 bg-white p-28 left-[section] max-md:w-full">
      <div class="text-center">
        <h1 class="text-[#040D25] text-[48px] leading-[56px] font-bold mb-4">404</h1>
        <h2 class="text-[#040D25] text-[32px] leading-[40px] font-semibold mb-4">
          Página não encontrada
        </h2>
        <p class="font-inter text-[#222A3F] text-[16px] leading-[24px] mb-8">
          Oops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
        </p>
      </div>

      <div class="flex flex-col gap-6 w-full max-sm:items-center">
        <div>
          <router-link
            to="/"
            class="bg-[#CF631C] rounded py-3 px-6 group relative w-full flex justify-center text-white hover:text-white font-inter text-[16px] leading-6 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Voltar para a página inicial
          </router-link>
        </div>

       <!--  <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <span>Precisa de ajuda? </span>
          <a href="mailto:suporte@empresa.com" class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
            Contate nosso suporte
          </a>
        </div> -->
      </div>
    </div>

    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup>
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
</script>