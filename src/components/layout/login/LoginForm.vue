<template>
  <form class="flex flex-col gap-4 w-full" @submit.prevent="handleLogin">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1 w-full">
          <label class="flex items-center gap-0.5 text-sm font-medium text-[rgba(4,13,37,1)]">
            <span class="text-[#040D25] text-[14px] font-medium leading-5">Email</span>
            <span class="text-[#BE3E37] font-inter text-[14px] leading-5 font-medium">*</span>
          </label>
          <div class="h-[56px] flex items-center border gap-2 px-3 py-4 rounded-lg border-solid border-[#B8B8B8]">
            <div>
              <EmailIcon></EmailIcon>
            </div>
            <input v-model="email" type="email" placeholder="Digite seu email"
              class="flex-1 bg-transparent outline-none font-inter text-[#222A3F] leading-5" required
              :disabled="loading" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[14px] font-medium">Senha <span class="text-[#BE3E37]">*</span></label>
            <div class="h-[56px] flex items-center border gap-2 px-3 py-4 rounded-lg border-solid border-[#B8B8B8]">
            <div>
              <PasswordIcon></PasswordIcon>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="flex-1 bg-transparent outline-none font-inter text-[#222A3F] leading-5"
              required
              :disabled="loading"
            />
            <button 
              type="button" 
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="p-0 bg-transparent border-none outline-none transition-all duration-300 hover:bg-[#b8b8b82f]"
              @click="showPassword = !showPassword"
            >
              <EyeIcon></EyeIcon>
            </button>
          </div>
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
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="loading"
          :loading="loading">
          Entrar
        </BaseButton>

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
import BaseButton from '@/components/common/BaseButton.vue'
import EmailIcon from '@/components/common/icons/EmailIcon.vue'
import PasswordIcon from '@/components/common/icons/PasswordIcon.vue'
import EyeIcon from '@/components/common/icons/EyeIcon.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
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
