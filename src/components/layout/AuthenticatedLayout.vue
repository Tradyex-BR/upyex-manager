<template>
  <div v-if="checkingAuth || loading" class="flex w-full h-full items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else-if="authStore.isAuthenticated">
    <slot></slot>
  </div>
  <div v-else class="flex w-full h-full items-center justify-center text-gray-400">
    Você não está autenticado.
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps<{
  loading?: boolean
}>()

const authStore = useAuthStore()
const router = useRouter()
const checkingAuth = ref(true)

// Monitora mudanças no estado de autenticação
watch(() => authStore.isAuthenticated, (newValue) => {
  if (!newValue) {
    router.push('/login')
  }
})

onMounted(async () => {
  await authStore.checkAuth()
  checkingAuth.value = false
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script> 