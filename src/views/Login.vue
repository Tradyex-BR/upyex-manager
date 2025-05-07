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
          Manter conectado
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/layout/login/LoginForm.vue'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'
import VerticalLines from '@/components/layout/login/VerticalLines.vue'
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