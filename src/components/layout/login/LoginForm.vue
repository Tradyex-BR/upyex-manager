<template>
  <form class="flex flex-col gap-4 w-full" @submit.prevent="handleLogin">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1"> 
          <label class="text-[14px] font-medium">Email <span class="text-[#BE3E37]">*</span></label>
          <input v-model="email" type="email" placeholder="Digite seu email" required :disabled="loading"
            autocomplete="username" class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[14px] font-medium">Senha <span class="text-[#BE3E37]">*</span></label>
          <input v-model="password" type="password" placeholder="Digite sua senha" required :disabled="loading"
            autocomplete="current-password" class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[14px] font-medium">Tipo de usuário <span class="text-[#BE3E37]">*</span></label>
          <select v-model="role" :disabled="loading"
            class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none bg-white">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button type="submit" :disabled="loading"
          class="bg-[#CF631C] text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
          <router-link to="/forgot-password" class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
            Esqueci minha senha
          </router-link>
        </div>
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref<'MANAGER' | 'AFFILIATE'>('MANAGER')
const roles = ['MANAGER', 'AFFILIATE']
const loading = ref(false)
const error = ref('')

const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      role: role.value,
      fingerprint: 'Qg0JCu3FzrLMH3tPTWIP'
    })
    router.push('/dashboard')
  } catch (err: any) {
    if (err.response?.data?.message && err.response.data.message.toLowerCase().includes('senha')) {
      error.value = 'Você precisa definir uma senha antes do primeiro acesso. Clique em "Esqueci minha senha" para criar sua senha.'
    } else {
      error.value = err.response?.data?.message || 'Erro ao autenticar'
    }
  } finally {
    loading.value = false
  }
}




</script>
