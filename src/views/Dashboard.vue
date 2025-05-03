<template>
  <div v-if="checkingAuth" class="flex w-full h-full items-center justify-center text-gray-400">
    <LoadingSpinner message="Verificando autenticação..." />
  </div>
  <div v-else-if="authStore.isAuthenticated">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full">
            <!-- Feedback do carregamento dos dados -->
            <div v-if="dashboardLoading" class="flex w-full h-full items-center justify-center text-gray-400 py-8">
              <LoadingSpinner message="Carregando dados do dashboard..." />
            </div>

            <!-- Feedback de erro -->
            <div v-else-if="dashboardError" class="flex flex-col w-full items-center justify-center text-red-500 py-8">
              <AlertIcon class="w-10 h-10 mb-2" />
              <p>{{ dashboardError }}</p>
              <button @click="fetchDashboardData"
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Tentar novamente
              </button>
            </div>

            <!-- Conteúdo principal -->
            <template v-else>
              <div class="flex justify-between items-center mb-6">
                <DateRangePicker
                  v-model:startDate="startDate"
                  v-model:endDate="endDate"
                  @apply="fetchDashboardData"
                />
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Buscar..."
                    class="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    @input="handleSearch"
                  />
                </div>
              </div>
              <DashboardCards v-if="dashboardData" :data="dashboardData" />
              <DashboardNavigation v-model="currentView" />

              <div v-if="currentView === 'cards'" class="flex flex-col gap-6 mt-6">
                <GraphicSection title="Vendas diárias" description="Quantidade de vendas nos últimos 15 dias"
                  class="h-[382px]">
                  <template v-if="getChartData('graph')?.length">
                    <CartesianAxes :data="getChartData('graph')" />
                  </template>
                  <template v-else>
                    <EmptyState message="Não há dados de vendas disponíveis para o período selecionado" />
                  </template>
                </GraphicSection>

                <div class="grid grid-cols-2 gap-6 mb-8">
                  <GraphicSection title="Status das vendas" description="Distribuição por status de pagamento"
                    class="h-[446px]">
                    <div class="flex gap-8 h-full justify-center items-center">
                      <template v-if="getChartData('by_payment_status')?.length && getChartData('by_payment_status')?.some(item => item.count > 0)">
                        <DoughnutChart :data="getChartData('by_payment_status')" />
                        <div class="flex flex-col gap-4">
                          <DoughnutChartLegends :data="getChartData('by_payment_status')" />
                        </div>
                      </template>
                      <template v-else>
                        <EmptyState message="Não há dados de status de pagamento disponíveis" />
                      </template>
                    </div>
                  </GraphicSection>

                  <GraphicSection title="Método de pagamento" description="Distribuição por método de pagamento"
                    class="h-[446px]">
                    <template v-if="getChartData('by_payment_method')?.methods?.length">
                      <PaymentMethodCards :data="getChartData('by_payment_method')" />
                    </template>
                    <template v-else>
                      <EmptyState message="Não há dados de métodos de pagamento disponíveis" />
                    </template>
                  </GraphicSection>
                </div>
              </div>

              <div v-else-if="currentView === 'list'">
                <div class="flex flex-row gap-6" v-if="isManager">
                  <GraphicSection title="Análise de clientes" description="Detalhes sobre base de clientes"
                    class="w-[352px] h-[446px] mt-6">
                    <template v-if="customersData && Object.keys(customersData).length">
                      <DashboardCards :data="customersData" border vertical />
                    </template>
                    <template v-else>
                      <EmptyState message="Não há dados de clientes disponíveis" />
                    </template>
                  </GraphicSection>

                  <GraphicSection title="Status dos saques" description="Distribuição dos status por saque"
                    class="w-full h-[446px] mt-6">
                    <template v-if="withdrawalsData?.data?.length">
                      <BarChart :data="withdrawalsData" />
                    </template>
                    <template v-else>
                      <EmptyState message="Não há dados de saques disponíveis" />
                    </template>
                  </GraphicSection>
                </div>

                <div class="flex flex-row gap-6" v-else>
                  <GraphicSection title="Histórico de transações" description="Suas transações recentes"
                    class="w-full h-[446px] mt-6">
                    <template v-if="listData.length">
                      <TransactionHistory :transactions="listData" />
                    </template>
                    <template v-else>
                      <EmptyState message="Não há transações disponíveis" />
                    </template>
                  </GraphicSection>
                </div>
              </div>
            </template>
          </section>
        </div>
      </main>
    </div>
  </div>
  <div v-else class="flex w-full h-full items-center justify-center text-gray-400">
    <div class="flex flex-col items-center">
      <AlertIcon class="w-10 h-10 mb-2" />
      <p>Você não está autenticado.</p>
      <button @click="navigateToLogin" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Ir para o login
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue"
import DashboardNavigation from "@/components/layout/dashboard/DashboardNavigation.vue"
import CartesianAxes from "@/components/graphics/CartesianAxes.vue"
import DoughnutChart from "@/components/graphics/DoughnutChart.vue"
import DoughnutChartLegends from "@/components/graphics/DoughnutChartLegends.vue"
import PaymentMethodCards from "@/components/graphics/PaymentMethodCards.vue"
import GraphicSection from "@/components/graphics/GraphicSection.vue"
import { managerService } from '@/services/managerService'
import BarChart from "@/components/graphics/BarChart.vue"
import LoadingSpinner from "@/components/graphics/LoadingSpinner.vue"
import AlertIcon from "@/components/icons/AlertIcon.vue"
import EmptyState from "@/components/layout/dashboard/EmptyState.vue"
import TransactionHistory from "@/components/layout/dashboard/TransactionHistory.vue"
import { useDashboardData } from '@/composables/useDashboardData'
import { format } from 'date-fns'
import type { DashboardResponse } from '@/services/managerService'
import DateRangePicker from "@/components/layout/dashboard/DateRangePicker.vue"

// Stores e roteador
const authStore = useAuthStore()
const router = useRouter()

// Estado da tela
const checkingAuth = ref(true)
const dashboardLoading = ref(false)
const dashboardError = ref('')
const currentView = ref('cards')

// Estado dos dados
const loading = ref(false)
const error = ref<string | null>(null)
const startDate = ref(new Date())
const endDate = ref(new Date())
const searchQuery = ref('')
const dashboardData = ref<Record<string, { value: string; label: string }> | null>(null)
const withdrawalsData = ref<{ data: Array<{ label: string; value: number }> } | null>(null)
const customersData = ref<{ total: number } | null>(null)
const chartData = ref<Array<{ status: string; data: Array<{ date: string; count: number }> }>>([])
const paymentMethods = ref<Array<{ label: string; value: number; icon: string; iconColor: string; barColor: string; percentage?: number }>>([])
const paymentStatus = ref<Array<{ label: string; value: number }>>([])
const listData = ref<Array<{ date: string; description: string; value: string; status: string }>>([])

// Data utils
const {
  processPaymentMethods,
  processPaymentStatus,
  processDashboardCards,
  processWithdrawalsData
} = useDashboardData()

// Computados
const isManager = computed(() => localStorage.getItem('role') === 'manager')

// Data getters - facilita o acesso aos dados com tratamento de erros
const getChartData = (status: string) => {
  const found = chartData.value.find(item => item.status === status)
  return found ? found.data : null
}

// Navigation
function navigateToLogin() {
  router.push('/login')
}

// Data fetching
async function fetchDashboardData() {
  try {
    loading.value = true
    error.value = null

    const start_date = formatDate(startDate.value)
    const end_date = formatDate(endDate.value)

    const params = {
      start_date,
      end_date,
      search: searchQuery.value
    }

    const response = await managerService.dashboard.getData(params)
    
    // Processa os dados usando o composable
    dashboardData.value = processDashboardCards(response, isManager.value)
    withdrawalsData.value = processWithdrawalsData(response.withdrawals?.by_status)
    customersData.value = response.customers || { total: 0 }
    
    // Atualiza os dados do gráfico
    chartData.value = [
      {
        status: 'graph',
        data: response.sales?.graph?.map((item: { date: string; count: number }) => ({
          date: item.date,
          count: item.count
        })) || []
      },
      {
        status: 'by_payment_status',
        data: Object.entries(response.sales?.cards?.by_status || {}).map(([label, value]) => ({
          date: label,
          count: value as number
        }))
      },
      {
        status: 'by_payment_method',
        data: Object.entries(response.sales?.cards?.by_payment_method || {}).map(([label, value]) => ({
          date: label,
          count: value as number
        }))
      }
    ]

    paymentMethods.value = processPaymentMethods(response.sales?.cards?.by_payment_method || {}, response.sales?.cards?.by_status?.paid || 0)
    paymentStatus.value = processPaymentStatus(response.sales?.cards?.by_status || {})

    // Dados para a lista de transações
    listData.value = [
      {
        date: '2025-04-25',
        description: 'Venda #1234',
        value: 'R$ 150,00',
        status: 'paid'
      },
      {
        date: '2025-04-26',
        description: 'Venda #1235',
        value: 'R$ 200,00',
        status: 'pending'
      }
    ]

  } catch (err) {
    console.error('Erro ao buscar dados do dashboard:', err)
    error.value = 'Erro ao carregar dados do dashboard'
    dashboardData.value = null
    withdrawalsData.value = null
    customersData.value = null
    chartData.value = []
    paymentMethods.value = []
    paymentStatus.value = []
    listData.value = []
  } finally {
    loading.value = false
  }
}

// Limpa os dados em caso de erro
function clearData() {
  dashboardData.value = null
  chartData.value = []
  customersData.value = null
  withdrawalsData.value = null
  listData.value = []
}

async function handleSearch(event: Event) {
  const input = event.target as HTMLInputElement
  searchQuery.value = input.value
  await fetchDashboardData()
}

function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

onMounted(async () => {
  try {
    await authStore.checkAuth()
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error)
  } finally {
    checkingAuth.value = false
  }

  if (authStore.isAuthenticated) {
    await fetchDashboardData()
  }
})
</script>