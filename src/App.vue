<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Sidebar from './components/layout/dashboard/Sidebar.vue';
import TopBar from './components/layout/dashboard/TopBar.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<template>
  <div class="min-h-screen bg-[#040D25]">
    <!-- Layout para páginas de autenticação -->
    <div v-if="isLoginPage" class="min-h-screen flex items-center justify-center">
      <router-view></router-view>
    </div>

    <!-- Layout padrão para o resto da aplicação -->
    <div v-else class="min-h-screen flex">
      <Sidebar />
      <div class="flex-1 flex flex-col">
        <TopBar />
        <main class="flex-1 pt-[32px] pl-[32px] pr-[32px]">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos globais podem ser adicionados aqui */
</style>
