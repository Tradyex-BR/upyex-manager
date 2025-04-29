<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex z-50 flex-col w-6/12 backdrop-blur-lg items-center gap-8 bg-white p-28 left-[section] max-md:w-full">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M52.1627 19.8508L32.0134 40.0002L21.9414 29.9255" stroke="#01DD56" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M56 32C56 45.256 45.256 56 32 56C18.744 56 8 45.256 8 32C8 18.744 18.744 8 32 8C35.8747 8 39.5227 8.94133 42.7627 10.5707"
          stroke="#01DD56" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
        Senha alterada com sucesso
      </h1>
      <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
        Faça seu login
      </div>

      <div class="flex flex-col gap-6 w-full max-sm:items-center mt-4">
        <div>
          <router-link to="/login"
            class="bg-[#CF631C] rounded py-2 px-4 group relative w-full flex justify-center text-[#F7F7F8] hover:text-[#F7F7F8] font-inter text-[14px] leading-6 font-bold hover:border-[#CF631C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-center">
            Login
          </router-link>
        </div>
      </div>
    </div>

    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
</script>