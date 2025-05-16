<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, watch, ref, onMounted } from 'vue';
import Sidebar from './components/layout/dashboard/Sidebar.vue';
import TopBar from './components/layout/dashboard/TopBar.vue';
import { logger } from './config/logger';
import { useAuthStore } from '@/stores/auth';
import { CONTEXT_ROLE_KEY } from './config/constants';

const pagesThatDontHaveSidebar = [
  '/login/manager',
  '/login/affiliate',
  '/forgot-password/manager',
  '/forgot-password/affiliate',
  '/email-sent/manager',
  '/email-sent/affiliate',
  '/reset-password/manager',
  '/reset-password/affiliate',
  '/password-changed'
];

const affiliatesPages = [
  '/login/affiliate',
  '/forgot-password/affiliate',
  '/email-sent/affiliate',
  '/reset-password/affiliate',
]

const route = useRoute();
const authStore = useAuthStore();
const isLoading = ref(true);

const thisPageHaveSidebar = computed(() =>
  !pagesThatDontHaveSidebar.includes(route.path) && route.name !== 'NotFoundAffiliate' && route.name !== 'NotFoundManager'
);

const fullPath = computed(() => route.fullPath);

const searchTerm = ref('')
function onSearch(term: string) {
  logger.info('onSearch (App.vue) recebeu:', term)
  searchTerm.value = term
}

watch(fullPath, (newPath) => {
  if (newPath.includes('manager')) {
    localStorage.setItem(CONTEXT_ROLE_KEY, 'manager');
  } else if (affiliatesPages.some(page => newPath.includes(page))) {
    localStorage.setItem(CONTEXT_ROLE_KEY, 'affiliate');
  }
});

onMounted(async () => {
  await authStore.checkAuth();
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="min-h-screen bg-[#040D25] flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else class="min-h-screen bg-[#040D25]">
    <!-- Layout para páginas de autenticação -->
    <div v-if="!thisPageHaveSidebar" class="min-h-screen flex items-center justify-center">
      <router-view></router-view>
    </div>

    <!-- Layout padrão para o resto da aplicação -->
    <div v-else-if="authStore.isAuthenticated" class="h-screen flex">
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <TopBar @search="onSearch" />
        <main class="flex-1 overflow-y-auto p-[32px]">
          <router-view v-slot="{ Component }">
            <component :is="Component" :searchTerm="searchTerm" />
          </router-view>
        </main>
      </div>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
/* Estilos globais podem ser adicionados aqui */

/* Estilização da barra de rolagem */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1f2e;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #2d3748;
  border-radius: 4px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a5568;
}

/* Para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #2d3748 #1a1f2e;
}
</style>
