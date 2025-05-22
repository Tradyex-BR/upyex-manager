export interface DashboardParams {
  start_date: string
  end_date: string
  search?: string
}

export interface DashboardResponse {
  balance?: {
    current_balance: number
    future_balance: number
    next_7_days: number
  }
  sales: {
    cards: {
      by_status: {
        awaiting_payment: number
        paid: number
        refunded: number
        cancelled: number
        failed: number
      }
      by_payment_method: {
        bank_transfer: number
        credit_card: number
        debit_card: number
        payment_link: number
        pix: number
      }
      total_sales?: number
    }
    graph: Array<{
      date: string
      count: number
    }>
  }
  withdrawals: {
    by_status: {
      requested: number
      approved: number
      rejected: number
      processing: number
      processed: number
      cancelled: number
      failed: number
    }
  }
  customers: {
    total: number
    new: number
  }
}

export interface DashboardCard {
  value: string
  label: string
}

export interface DashboardData {
  paid: DashboardCard
  customers: DashboardCard
  withdrawals: DashboardCard
}

export interface PaymentMethod {
  label: string
  value: number
  icon: string
  iconColor: string
  barColor: string
  percentage: number
}

export interface ChartData {
  status: 'graph' | 'by_payment_status' | 'by_payment_method'
  data: {
    date?: string
    value?: number
    label?: string
    methods?: PaymentMethod[]
    totalPaid?: number
  }[] | {
    methods: PaymentMethod[]
    totalPaid: number
  }
}

export interface WithdrawalData {
  data: Array<{
    label: string
    value: number
  }>
}

export interface ListItem {
  date: string
  description: string
  value: string
  status: string
} 