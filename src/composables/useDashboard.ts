import { ref, computed } from 'vue'
import { managerService } from '@/services/managerService'
import {
  DashboardParams,
  DashboardResponse
} from '@/types/dashboard'

export function useDashboard() {
  const data = ref<DashboardResponse>({
    sales: {
      cards: {
        by_status: {
          awaiting_payment: 0,
          paid: 0,
          refunded: 0,
          cancelled: 0,
          failed: 0
        },
        by_payment_method: {
          bank_transfer: 0,
          credit_card: 0,
          debit_card: 0,
          payment_link: 0,
          pix: 0
        }
      },
      graph: []
    },
    withdrawals: {
      by_status: {
        requested: 0,
        approved: 0,
        rejected: 0,
        processing: 0,
        processed: 0,
        cancelled: 0,
        failed: 0
      }
    },
    customers: {
      total: 0,
      new: 0
    }
  })
  const loading = ref(true)
  const error = ref('')
  const useMockData = ref(true)

  const role = computed(() => {
    return localStorage.getItem('role') || 'manager'
  })

  const ManagerMockData: DashboardResponse = {
    sales: {
      cards: {
        by_status: {
          awaiting_payment: 10,
          paid: 0,
          refunded: 0,
          cancelled: 0,
          failed: 0
        },
        by_payment_method: {
          bank_transfer: 5,
          credit_card: 10,
          debit_card: 46,
          payment_link: 345,
          pix: 25
        }
      },
      graph: [
        {
          date: "2025-04-25",
          count: 10
        },
        {
          date: "2025-04-26",
          count: 56
        },
        {
          date: "2025-04-27",
          count: 24
        },
        {
          date: "2025-04-28",
          count: 966
        },
        {
          date: "2025-04-29",
          count: 423
        }
      ]
    },
    withdrawals: {
      by_status: {
        requested: 0,
        approved: 0,
        rejected: 0,
        processing: 0,
        processed: 0,
        cancelled: 0,
        failed: 0
      }
    },
    customers: {
      total: 45,
      new: 35
    }
  }

  const AffiliateMockData: DashboardResponse = {
    balance: {
      current_balance: 0,
      future_balance: 0,
      next_7_days: 0
    },
    sales: {
      cards: {
        by_status: {
          awaiting_payment: 0,
          paid: 0,
          refunded: 0,
          cancelled: 0,
          failed: 0
        },
        by_payment_method: {
          bank_transfer: 0,
          credit_card: 0,
          debit_card: 0,
          payment_link: 0,
          pix: 0
        }
      },
      graph: [
        {
          date: "2025-04-25",
          count: 0
        },
        {
          date: "2025-04-26",
          count: 0
        },
        {
          date: "2025-04-27",
          count: 0
        },
        {
          date: "2025-04-28",
          count: 0
        },
        {
          date: "2025-04-29",
          count: 0
        }
      ]
    },
    withdrawals: {
      by_status: {
        requested: 10,
        approved: 0,
        rejected: 0,
        processing: 0,
        processed: 0,
        cancelled: 0,
        failed: 0
      }
    },
    customers: {
      total: 20,
      new: 20
    }
  }

  const fetchData = async () => {
    loading.value = true
    error.value = ''
    try {
      if (useMockData.value) {
        data.value = role.value === 'manager' ? ManagerMockData : AffiliateMockData
      } else {
        const params: DashboardParams = {
          start_date: "2025-04-25",
          end_date: "2025-04-29",
        }
        data.value = await managerService.dashboard.getData(params)
      }
    } catch (e: any) {
      console.error('Erro ao buscar dashboard:', e)
      error.value = e?.message || 'Erro ao carregar dados do dashboard'
      data.value = {} as DashboardResponse
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
  }
} 