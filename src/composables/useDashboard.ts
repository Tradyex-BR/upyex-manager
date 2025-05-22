  import { ref, computed } from 'vue'
  import { managerService } from '@/services/managerService'
  import {
    DashboardParams,
    DashboardResponse
  } from '@/types/dashboard'
  import { CONTEXT_ROLE_KEY } from '@/config/constants'
  import { logger } from '@/config/logger'
  import { notificationService } from '@/services/notificationService'

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
          },
          total_sales: 0
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
    const useMockData = ref(false)

    const role = computed(() => {
      return localStorage.getItem(CONTEXT_ROLE_KEY) || 'manager'
    })

    const ManagerMockData: DashboardResponse = {
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
          },
          total_sales: 100
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
    }

    const fetchData = async (action?: string, dateParams?: { start_date: string; end_date: string }) => {
      loading.value = true
      error.value = ''
      try {
        if (useMockData.value) {
          data.value = role.value === 'manager' ? ManagerMockData : AffiliateMockData
        } else {
          const today = new Date()
          const sevenDaysAgo = new Date(today)
          sevenDaysAgo.setDate(today.getDate() - 7)

          const params: DashboardParams = dateParams || {
            start_date: sevenDaysAgo.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0],
          }
          const formattedAction = action === 'Pagos' ? 1 : 0
          data.value = await managerService.dashboard.getData(params, formattedAction)
        }
      } catch (e) {
        logger.error('Erro ao buscar dashboard:', e)
        notificationService.error('Erro ao carregar dados do dashboard')
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