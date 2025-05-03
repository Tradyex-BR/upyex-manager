<template>
  <div v-if="checkingAuth" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="authStore.isAuthenticated">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full">
            <DashboardCards v-if="dashboardData" :data="dashboardData" />
            <DashboardNavigation v-model="currentView" />

            <div v-if="currentView === 'cards'" class="flex flex-col gap-6 mt-6">
              <GraphicSection title="Vendas diárias" description="Quantidade de vendas nos últimos 15 dias" class="h-[382px]">
                <CartesianAxes v-if="chartData.length > 0" :data="chartData.filter(item => item.status === 'graph')" />
              </GraphicSection>

              <div class="grid grid-cols-2 gap-8 mb-8">
                <GraphicSection title="Status das vendas" description="Distribuição por status de pagamento" class="h-[446px]">
                  <div class="flex gap-8 h-full justify-center items-center">
                    <DoughnutChart v-if="chartData.length > 0" :data="chartData.find(item => item.status === 'by_payment_status')" />
                    <div class="flex flex-col gap-4">
                      <DoughnutChartLegends v-if="chartData.length > 0" :data="chartData.find(item => item.status === 'by_payment_status')" />
                    </div>
                  </div>
                </GraphicSection>
                <GraphicSection title="Método de pagamento" description="Distribuição por método de pagamento" class="h-[446px]">
                  <PaymentMethodCards v-if="chartData.length > 0" :data="chartData.find(item => item.status === 'by_payment_method')" />
                </GraphicSection>
              </div>
            </div>
            <div v-else-if="currentView === 'list'">
              <DashboardList :data="listData" />
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
import DoughnutChart from "@/components/graphics/DoughnutChart.vue"
import DoughnutChartLegends from "@/components/graphics/DoughnutChartLegends.vue"
import PaymentMethodCards from "@/components/graphics/PaymentMethodCards.vue"
import GraphicSection from "@/components/graphics/GraphicSection.vue"
import TopBar from "@/components/layout/dashboard/TopBar.vue"
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

    // Dados para os gráficos
    const totalPaid = response.sales?.cards?.by_status?.paid || 0

    // Primeiro, vamos agrupar os métodos de pagamento
    const paymentMethods = Object.entries(response.sales?.cards?.by_payment_method || {})
      .reduce((acc, [key, value]) => {
        const lowerKey = key.toLowerCase()
        let groupKey = 'other'
        let groupLabel = 'Outros'

        if (lowerKey.includes('credit') || lowerKey.includes('card') || lowerKey.includes('debit')) {
          groupKey = 'card'
          groupLabel = 'Conversão de cartão'
        } else if (lowerKey.includes('pix')) {
          groupKey = 'pix'
          groupLabel = 'Conversão de pix'
        } else if (lowerKey.includes('bank') || lowerKey.includes('transfer') || lowerKey.includes('payment_link')) {
          groupKey = 'bank'
          groupLabel = 'Conversão de boleto'
        }

        if (!acc[groupKey]) {
          acc[groupKey] = {
            label: groupLabel,
            value: 0,
            icon: groupKey,
            iconColor: groupKey === 'card' ? 'text-blue-400' : 
                      groupKey === 'pix' ? 'text-green-400' : 
                      groupKey === 'bank' ? 'text-purple-400' : 'text-gray-400',
            barColor: groupKey === 'card' ? 'bg-blue-500' : 
                     groupKey === 'pix' ? 'bg-green-500' : 
                     groupKey === 'bank' ? 'bg-purple-500' : 'bg-gray-500'
          }
        }
        acc[groupKey].value += value
        return acc
      }, {} as Record<string, any>)

    // Garante que temos todas as categorias com valores iniciais
    const mainCategories = {
      card: {
        label: 'Conversão de cartão',
        value: 0,
        icon: 'card',
        iconColor: 'text-blue-400',
        barColor: 'bg-blue-500'
      },
      pix: {
        label: 'Conversão de pix',
        value: 0,
        icon: 'pix',
        iconColor: 'text-green-400',
        barColor: 'bg-green-500'
      },
      bank: {
        label: 'Conversão de boleto',
        value: 0,
        icon: 'bank',
        iconColor: 'text-purple-400',
        barColor: 'bg-purple-500'
      },
      other: {
        label: 'Outros',
        value: 0,
        icon: 'other',
        iconColor: 'text-gray-400',
        barColor: 'bg-gray-500'
      }
    }

    // Combina os métodos agrupados com as categorias principais
    const finalMethods = {
      ...mainCategories,
      ...paymentMethods
    }

    // Ordena os métodos na ordem desejada e calcula as porcentagens
    const orderedMethods = {
      card: {
        ...finalMethods.card,
        percentage: totalPaid > 0 ? Math.round((finalMethods.card.value / totalPaid) * 100) : 0
      },
      pix: {
        ...finalMethods.pix,
        percentage: totalPaid > 0 ? Math.round((finalMethods.pix.value / totalPaid) * 100) : 0
      },
      bank: {
        ...finalMethods.bank,
        percentage: totalPaid > 0 ? Math.round((finalMethods.bank.value / totalPaid) * 100) : 0
      },
      other: {
        ...finalMethods.other,
        percentage: totalPaid > 0 ? Math.round((finalMethods.other.value / totalPaid) * 100) : 0
      }
    }

    chartData.value = [
      {
        status: 'graph',
        data: response.sales?.graph || []
      },
      {
        status: 'by_payment_status',
        data: Object.entries(response.sales?.cards?.by_status || {}).map(([key, value]) => ({
          label: key,
          value: value
        }))
      },
      {
        status: 'by_payment_method',
        data: {
          methods: Object.values(orderedMethods),
          totalPaid
        }
      }
    ].filter(item => {
      if (item.status === 'by_payment_method') {
        return item.data.methods && item.data.methods.length > 0
      }
      return item.data && Array.isArray(item.data) && item.data.length > 0
    })

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