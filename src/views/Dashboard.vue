<template>
  <div v-if="checkingAuth" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="authStore.isAuthenticated" class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <TopBar @search="handleSearch" />
            <DashboardCards v-if="dashboardData" :data="dashboardData" />
            <!-- <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
              <AssetTable v-if="authStore.user && authStore.user.role === 'MANAGER'" />
              <AffiliateTable v-if="authStore.user && authStore.user.role === 'MANAGER'" />
              <div v-if="authStore.user && authStore.user.role === 'AFFILIATE'" class="w-full">
                <p class="text-lg font-semibold mb-2">Bem-vindo, {{ authStore.user.name }}!</p>
                <p>Seu email: {{ authStore.user.email }}</p>
                <p>Perfil: Afiliado</p>
              </div>
            </div> -->
          </section>
        </div>
      </main>
    </div>
  </div>
  <div v-else class="flex w-full h-full items-center justify-center text-gray-400">
    Você não está autenticado.
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue";
import AssetTable from "@/components/layout/dashboard/AssetTable.vue";
import AffiliateTable from "@/components/layout/dashboard/AfilliateTable.vue";
import { managerService } from '@/services/managerService';

const authStore = useAuthStore()
const checkingAuth = ref(true)
const dashboardData = ref<any>({})
const dashboardLoading = ref(false)
const dashboardError = ref('')

async function fetchDashboardData() {
  dashboardLoading.value = true
  dashboardError.value = ''
  try {
    // Default params for sales list (adjust as needed)
    const start_date = "2025-04-25"
    const end_date = "2025-04-29"
    const params = {
      start_date: start_date,
      end_date: end_date,
    }
    console.log('Iniciando fetch do dashboard', params);
    const response = await managerService.dashboard.getData(params)
    console.log('Resposta do dashboard:', response);
    dashboardData.value = response
  } catch (e: any) {
    console.error('Erro ao buscar dashboard:', e);
    dashboardError.value = e?.message || 'Erro ao carregar dados do dashboard'
    dashboardData.value = {} // Evita erro de acesso a null
  } finally {
    dashboardLoading.value = false
  }
}

async function handleSearch(term: string) {
  dashboardLoading.value = true
  dashboardError.value = ''
  try {
    // Exemplo: use o termo de busca como parte dos parâmetros
    const params = {
      search: term
    }
    const response = await managerService.dashboard.getData(params)
    dashboardData.value = response
  } catch (e: any) {
    dashboardError.value = e?.message || 'Erro ao carregar dados do dashboard'
    dashboardData.value = {}
  } finally {
    dashboardLoading.value = false
  }
}

onMounted(async () => {
  await authStore.checkAuth()
  checkingAuth.value = false
  if (authStore.user && authStore.user.role === 'MANAGER') {
    await fetchDashboardData()
  }
})
</script>