<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[32px] font-semibold text-[rgba(4,13,37,1)] leading-10">
        Boas vindas ao TradyEx
      </h1>
      <div class="text-sm font-normal text-[rgba(34,42,63,1)] leading-[18px]">
        Manter conectado
      </div>

      <SocialLogin />

      <LoginForm />
    </div>

    <LoginBackground />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SocialLogin from '@/components/layout/login/SocialLogin.vue'
import LoginForm from '@/components/layout/login/LoginForm.vue'
import LoginBackground from '@/components/layout/login/LoginBackground.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isDev = import.meta.env.DEV

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    await authStore.login({
      email: email.value,
      password: password.value
    })

    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ocorreu um erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>