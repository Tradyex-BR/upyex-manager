<template>
  <div
    class="max-w-none flex flex-row w-full h-screen bg-[#010309] mx-auto max-md:max-w-[991px] max-md:flex-col max-sm:max-w-screen-sm">
    <div class="flex flex-col w-6/12 backdrop-blur-lg items-start gap-8 bg-white p-28 left-[section] max-md:w-full">
      <h1 class="text-[32px] font-semibold text-[rgba(4,13,37,1)] leading-10">
        Esqueceu a senha
      </h1>
      <div class="text-sm font-normal text-[rgba(34,42,63,1)] leading-[18px]">
        Insira o endereço de e-mail vinculado à sua conta e enviaremos um link para redefinir sua senha.
      </div>

      <form @submit.prevent="handleSubmit" class="w-full">
        <div class="mb-6">
          <label class="block text-sm font-medium text-[rgba(34,42,63,1)] mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="Digite seu email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div class="absolute right-3 top-3 text-gray-400">
              @
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Enviando...' : 'Redefinir' }}
        </button>

        <div class="mt-4 text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-700">
            Lembrou sua senha? Clique aqui
          </router-link>
        </div>
      </form>
    </div>

    <ForgotPasswordBackground />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ForgotPasswordBackground from '@/components/layout/login/ForgotPasswordBackground.vue'

const router = useRouter()
const email = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    // Aqui você implementará a lógica de recuperação de senha
    // await authStore.forgotPassword(email.value)
    // Após o envio bem-sucedido, você pode redirecionar ou mostrar uma mensagem
    router.push('/email-sent')
  } catch (error) {
    console.error('Erro ao solicitar recuperação de senha:', error)
  } finally {
    loading.value = false
  }
}
</script> 