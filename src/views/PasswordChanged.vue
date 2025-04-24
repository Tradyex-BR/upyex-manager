<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[32px] font-semibold text-[rgba(4,13,37,1)] leading-10">
        Senha alterada com sucesso
      </h1>
      <div class="text-sm font-normal text-[rgba(34,42,63,1)] leading-[18px]">
        Faça seu login
      </div>

      <div class="w-full">
        <router-link 
          to="/login"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
        >
          Login
        </router-link>
      </div>
    </div>

    <ForgotPasswordBackground />
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordBackground from '@/components/layout/login/ForgotPasswordBackground.vue'
</script> 