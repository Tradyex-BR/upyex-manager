<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
        Senha alterada com sucesso
      </h1>
      <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
        Faça seu login
      </div>

      <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
        <div>
          <router-link 
            to="/login"
            class="bg-[#CF631C] rounded py-2 px-4 group relative w-full flex justify-center text-[#F7F7F8] font-inter text-[14px] leading-6 font-bold hover:border-[#CF631C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-block text-center"
          >
            Login
          </router-link>
        </div>
      </div>
    </div>

    <ForgotPasswordBackground />
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordBackground from '@/components/layout/login/ForgotPasswordBackground.vue'
</script> 