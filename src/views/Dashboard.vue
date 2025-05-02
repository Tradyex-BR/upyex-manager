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
            <DashboardNavigation v-model="currentView" />
            <div v-if="currentView === 'cards'" class="h-[400px]">
              <CartesianAxes v-if="chartData.length > 0" :data="chartData" />
            </div>
            <div v-else-if="currentView === 'list'">
              <h2 class="text-white text-2xl font-bold">Lista</h2>
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
import DashboardList from "@/components/layout/dashboard/DashboardList.vue"
import CartesianAxes from "@/components/graphics/CartesianAxes.vue"
import { managerService } from '@/services/managerService'

const authStore = useAuthStore()
const checkingAuth = ref(true)
const dashboardData = ref<any>({})
const chartData = ref<any[]>([])
const listData = ref<any[]>([])
const dashboardLoading = ref(false)
const dashboardError = ref('')
const role = localStorage.getItem('role')
const currentView = ref('cards')

async function fetchDashboardData() {
  dashboardLoading.value = true
  dashboardError.value = ''
  try {
    const start_date = "2025-04-25"
    const end_date = "2025-04-29"
    const params = {
      start_date,
      end_date,
    }
    console.log('Iniciando fetch do dashboard', params)
    const response = await managerService.dashboard.getData(params)
    console.log('Resposta do dashboard:', response)
    
    // Dados para os cards
    if (role === 'manager') {
      dashboardData.value = {
        paid: {
          value: response.sales.cards.by_status.paid.toString(),
          label: 'Vendas Pagas',
        },
        customers: {
          value: response.customers.total.toString(),
          label: 'Total de Clientes',
        },
        withdrawals: {
          value: Object.values(response.withdrawals.by_status).reduce((a, b) => a + b, 0).toString(),
          label: 'Total de Saques',
        }
      }
    } else {
      const balance = response.data?.balance || {}
      dashboardData.value = {
        paid: {
          value: `R$ ${(balance.current_balance || 0).toFixed(2)}`,
          label: 'Saldo Atual',
        },
        customers: {
          value: `R$ ${(balance.future_balance || 0).toFixed(2)}`,
          label: 'Saldo Futuro',
        },
        withdrawals: {
          value: `R$ ${(balance.next_7_days || 0).toFixed(2)}`,
          label: 'Próximos 7 dias',
        }
      }
    }

    // Dados para o gráfico - mesmo caminho para ambos os roles
    if (response.sales?.graph) {
      chartData.value = response.sales.graph.map((item: any) => ({
        date: item.date,
        count: item.count
      }))
    } else {
      chartData.value = []
    }

    // Dados para a lista
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
  } catch (e: any) {
    console.error('Erro ao buscar dashboard:', e)
    dashboardError.value = e?.message || 'Erro ao carregar dados do dashboard'
    dashboardData.value = {}
    listData.value = []
  } finally {
    dashboardLoading.value = false
  }
}

async function handleSearch(term: string) {
  dashboardLoading.value = true
  dashboardError.value = ''
  try {
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
  await fetchDashboardData()
})
</script>