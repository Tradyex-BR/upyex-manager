<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="z-[100] flex flex-col justify-center w-6/12 backdrop-blur-lg items-start gap-8 bg-white bg-[url('/png/static-neon.png')] bg-no-repeat bg-top bg-center p-28 left-[section] max-md:w-full">
    
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="self-center">
        <path
d="M52.1627 19.8508L32.0134 40.0002L21.9414 29.9255" stroke="#01DD56" stroke-width="4"
          stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M56 32C56 45.256 45.256 56 32 56C18.744 56 8 45.256 8 32C8 18.744 18.744 8 32 8C35.8747 8 39.5227 8.94133 42.7627 10.5707"
          stroke="#01DD56" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <div class="flex flex-col gap-2 items-center self-center">
      <h1 class="text-[#040D25] text-[32px] leading-[40px] font-semibold">
        Senha alterada com sucesso
      </h1>
      <div class="font-inter text-[#222A3F] text-[14px] leading-[18px]">
        Faça seu login
      </div>
      </div>

      <div class="flex flex-col gap-6 w-full max-sm:items-center">
        <div>
          <BaseButton
            variant="primary"
            class="w-full"
            @click="router.push('/login')">
            Login
          </BaseButton>
        </div>
      </div>
    </div>

    <LoginBackground />
    <VerticalLines />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
</script>