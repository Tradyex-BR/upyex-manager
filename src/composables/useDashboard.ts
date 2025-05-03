import { ref } from 'vue'
import { managerService } from '@/services/managerService'
import {
  DashboardParams,
  DashboardResponse,
  DashboardData,
  ChartData,
  WithdrawalData,
  ListItem,
  PaymentMethod
} from '@/types/dashboard'

export function useDashboard() {
  const dashboardData = ref<DashboardData>({} as DashboardData)
  const chartData = ref<ChartData[]>([])
  const customersData = ref<{ total: number; new: number }>({ total: 0, new: 0 })
  const withdrawalsData = ref<WithdrawalData>({ data: [] })
  const listData = ref<ListItem[]>([])
  const dashboardLoading = ref(true)
  const dashboardError = ref('')
  const role = localStorage.getItem('role')

  const processPaymentMethods = (response: DashboardResponse, totalPaid: number): Record<string, PaymentMethod> => {
    const paymentMethods = Object.entries(response?.sales?.cards?.by_payment_method || {})
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
                groupKey === 'bank' ? 'bg-purple-500' : 'bg-gray-500',
            percentage: 0
          }
        }
        acc[groupKey].value += value as number
        return acc
      }, {} as Record<string, PaymentMethod>)

    const mainCategories: Record<string, PaymentMethod> = {
      card: {
        label: 'Conversão de cartão',
        value: 0,
        icon: 'card',
        iconColor: 'text-blue-400',
        barColor: 'bg-blue-500',
        percentage: 0
      },
      pix: {
        label: 'Conversão de pix',
        value: 0,
        icon: 'pix',
        iconColor: 'text-green-400',
        barColor: 'bg-green-500',
        percentage: 0
      },
      bank: {
        label: 'Conversão de boleto',
        value: 0,
        icon: 'bank',
        iconColor: 'text-purple-400',
        barColor: 'bg-purple-500',
        percentage: 0
      },
      other: {
        label: 'Outros',
        value: 0,
        icon: 'other',
        iconColor: 'text-gray-400',
        barColor: 'bg-gray-500',
        percentage: 0
      }
    }

    const finalMethods = {
      ...mainCategories,
      ...paymentMethods
    }

    return {
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
  }

  const processDashboardData = (response: DashboardResponse): DashboardData => {
    if (role === 'manager') {
      return {
        paid: {
          value: response?.sales?.cards?.by_status?.paid.toString() || '0',
          label: 'Vendas Pagas',
        },
        customers: {
          value: response?.customers?.total.toString() || '0',
          label: 'Total de Clientes',
        },
        withdrawals: {
          value: Object.values(response?.withdrawals?.by_status || {}).reduce((a: number, b: number) => a + b, 0).toString() || '0',
          label: 'Total de Saques',
        }
      }
    } else {
      const balance = response?.data?.balance || {}
      return {
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
  }

  const processChartData = (response: DashboardResponse): ChartData[] => {
    const totalPaid = response?.sales?.cards?.by_status?.paid || 0
    const orderedMethods = processPaymentMethods(response, totalPaid)

    return [
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
  }

  const fetchDashboardData = async () => {
    dashboardLoading.value = true
    dashboardError.value = ''
    try {
      const params: DashboardParams = {
        start_date: "2025-04-25",
        end_date: "2025-04-29",
      }
      const response = await managerService.dashboard.getData(params)

      withdrawalsData.value = {
        data: [
          { label: 'Solicitado', value: response.withdrawals?.by_status?.requested || 0 },
          { label: 'Aprovado', value: response.withdrawals?.by_status?.approved || 0 },
          { label: 'Rejeitado', value: response.withdrawals?.by_status?.rejected || 0 },
          { label: 'Em Processamento', value: response.withdrawals?.by_status?.processing || 0 },
          { label: 'Concluído', value: response.withdrawals?.by_status?.processed || 0 },
          { label: 'Cancelado', value: response.withdrawals?.by_status?.cancelled || 0 },
          { label: 'Falha', value: response.withdrawals?.by_status?.failed || 0 }
        ]
      }

      customersData.value = response.customers || { total: 0, new: 0 }
      dashboardData.value = processDashboardData(response)
      chartData.value = processChartData(response)

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
      dashboardData.value = {} as DashboardData
      listData.value = []
    } finally {
      dashboardLoading.value = false
    }
  }

  const handleSearch = async (term: string) => {
    dashboardLoading.value = true
    dashboardError.value = ''
    try {
      const params: DashboardParams = {
        start_date: "2025-04-25",
        end_date: "2025-04-29",
        search: term
      }
      const response = await managerService.dashboard.getData(params)
      dashboardData.value = processDashboardData(response)
    } catch (e: any) {
      dashboardError.value = e?.message || 'Erro ao carregar dados do dashboard'
      dashboardData.value = {} as DashboardData
    } finally {
      dashboardLoading.value = false
    }
  }

  return {
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
  }
} 