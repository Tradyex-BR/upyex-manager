<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Sidebar from './components/layout/dashboard/Sidebar.vue';
import TopBar from './components/layout/dashboard/TopBar.vue';

const pagesThatDontHaveSidebar = ['/login', '/forgot-password', '/email-sent', '/reset-password', '/password-changed'];

const route = useRoute();
import { ref } from 'vue'

const thisPageHaveSidebar = computed(() =>
  pagesThatDontHaveSidebar.includes(route.path) || route.name === 'NotFound'
);

const searchTerm = ref('')
function onSearch(term: string) {
  console.log('onSearch (App.vue) recebeu:', term)
  searchTerm.value = term
}

</script>

<template>
  <div class="min-h-screen bg-[#040D25]">
    <!-- Layout para páginas de autenticação -->
    <div v-if="thisPageHaveSidebar" class="min-h-screen flex items-center justify-center">
      <router-view></router-view>
    </div>

    <!-- Layout padrão para o resto da aplicação -->
    <div v-else class="h-screen flex">
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <TopBar @search="onSearch" />
        <main class="flex-1 overflow-y-auto pt-[32px] pl-[32px] pr-[32px]">
          <router-view v-slot="{ Component }">
            <component :is="Component" :searchTerm="searchTerm" />
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos globais podem ser adicionados aqui */
</style>
