<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary">Upyex Manager</h1>
            </div>
          </div>
          <div class="flex items-center">
            <div class="ml-3 relative">
              <div class="flex items-center">
                <span class="text-gray-700 mr-4">{{ user?.name }}</span>
                <button
                  @click="handleLogout"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar e Conteúdo Principal -->
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-sm h-screen">
        <nav class="mt-5 px-2">
          <router-link
            to="/dashboard"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[
              $route.path === '/dashboard'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            Dashboard
          </router-link>
          <!-- Adicione mais links do menu aqui -->
        </nav>
      </div>

      <!-- Conteúdo Principal -->
      <div class="flex-1 p-8">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script> 