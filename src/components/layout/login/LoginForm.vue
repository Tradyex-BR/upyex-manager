<template>
  <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-4">
      <label class="text-[14px] font-medium">Email <span class="text-[#BE3E37]">*</span></label>
      <input type="email" v-model="email" placeholder="Digite seu email" required :disabled="loading"
        autocomplete="username" class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none" />
      <label class="text-[14px] font-medium">Senha <span class="text-[#BE3E37]">*</span></label>
      <input type="password" v-model="password" placeholder="Digite sua senha" required :disabled="loading"
        autocomplete="current-password" class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none" />
      <label class="text-[14px] font-medium">Tipo de usuário <span class="text-[#BE3E37]">*</span></label>
      <select v-model="role" :disabled="loading"
        class="h-[56px] px-3 py-4 border border-[#B8B8B8] rounded-lg outline-none bg-white">
        <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
      </select>
      <button type="submit" :disabled="loading"
        class="bg-[#CF631C] text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <div class="text-center font-inter text-[14px] leading-[18px] text-[#040D25]">
        <router-link to="/forgot-password" class="text-[#CF631C] hover:underline hover:text-[#CF631C]">
          Esqueci minha senha
        </router-link>
      </div>
    </div>
    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { managerService } from '@/services/managerService'
import { affiliateService } from '@/services/affiliateService'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('MANAGER')
const roles = ['MANAGER', 'AFFILIATE']
const loading = ref(false)
const error = ref('')
const message = ref('')


const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    let response
    // Ajuste: fingerprint fixo conforme backend
    const fingerprint = 'Qg0JCu3FzrLMH3tPTWIP'
    if (role.value === 'MANAGER') {
      response = await managerService.auth.login({ email: email.value, password: password.value, fingerprint })
    } else if (role.value === 'AFFILIATE') {
      response = await affiliateService.auth.login({ email: email.value, password: password.value, fingerprint })
    }
    // Ajuste: backend retorna auth_token, não access_token
    if (response?.auth_token) {
      // Ajuste: salvar token conforme tipo de usuário
      if (role.value === 'MANAGER') {
        localStorage.setItem('manager_auth_token', response.auth_token)
      } else if (role.value === 'AFFILIATE') {
        localStorage.setItem('affiliate_auth_token', response.auth_token)
      }
      router.push('/dashboard')
    } else {
      error.value = 'Credenciais inválidas'
    }
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

const goToForgotPassword = () => {
  router.push({ path: '/forgot-password', query: { email: email.value, role: role.value } })
}


</script>
