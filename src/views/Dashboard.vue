<template>
  <div v-if="checkingAuth || dashboardLoading" class="flex w-full h-full items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else-if="authStore.isAuthenticated">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full">
            <DashboardCards v-if="dashboardData" :data="dashboardData" />
            <DashboardNavigation v-model="currentView" />

            <div v-if="currentView === 'cards'" class="flex flex-col gap-6 mt-6">
              <GraphicSection title="Vendas diárias" description="Quantidade de vendas nos últimos 15 dias"
                class="min-h-[382px]">
                <CartesianAxes v-if="chartData.length > 0" :data="chartData.filter(item => item.status === 'graph')" />
              </GraphicSection>

              <div class="grid grid-cols-2 gap-6 mb-8">
                <GraphicSection title="Status das vendas" description="Distribuição por status de pagamento"
                  class="h-[446px]">
                  <div class="flex gap-8 h-full justify-center items-center">
                    <DoughnutChart v-if="chartData.length > 0"
                      :data="chartData.find(item => item.status === 'by_payment_status')" />
                    <div class="flex flex-col gap-4">
                      <DoughnutChartLegends v-if="chartData.length > 0"
                        :data="chartData.find(item => item.status === 'by_payment_status')" />
                    </div>
                  </div>
                </GraphicSection>
                <GraphicSection title="Método de pagamento" description="Distribuição por método de pagamento"
                  class="h-[446px]">
                  <PaymentMethodCards v-if="chartData.length > 0"
                    :data="chartData.find(item => item.status === 'by_payment_method')" />
                </GraphicSection>
              </div>
            </div>
            <div v-else-if="currentView === 'list'">
              <div class="flex flex-row gap-6" v-if="role === 'manager'">
                <GraphicSection title="Análise de clientes" description="Detalhes sobre base de clientes"
                  class="max-w-[352px] max-h-[382px] mt-6 flex flex-col">
                  <DashboardCards v-if="customersData" :data="customersData" border vertical class="flex-1 max-h-[116px]" :gap="8" />
                </GraphicSection>
                <GraphicSection title="Status dos saques" description="Distribuição dos status por saque"
                  class="w-full h-[382px] mt-6">
                  <BarChart v-if="withdrawalsData" :data="withdrawalsData" />
                </GraphicSection>
              </div>
              <div class="flex flex-row gap-6" v-else>
                
              </div>
            </div>
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
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue"
import DashboardNavigation from "@/components/layout/dashboard/DashboardNavigation.vue"
import CartesianAxes from "@/components/graphics/CartesianAxes.vue"
import DoughnutChart from "@/components/graphics/DoughnutChart.vue"
import DoughnutChartLegends from "@/components/graphics/DoughnutChartLegends.vue"
import PaymentMethodCards from "@/components/graphics/PaymentMethodCards.vue"
import GraphicSection from "@/components/graphics/GraphicSection.vue"
import BarChart from "@/components/graphics/BarChart.vue"
import { useDashboard } from '@/composables/useDashboard'

const authStore = useAuthStore()
const checkingAuth = ref(true)
const currentView = ref('cards')

const {
  dashboardData,
  chartData,
  customersData,
  withdrawalsData,
  listData,
  dashboardLoading,
  dashboardError,
  role,
  fetchDashboardData,
  handleSearch
} = useDashboard()

onMounted(async () => {
  await authStore.checkAuth()
  checkingAuth.value = false
  await fetchDashboardData()
})
</script>