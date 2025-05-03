// src/composables/useDashboardData.ts
import { computed } from 'vue'
import type { DashboardResponse } from '@/services/managerService'

interface PaymentMethod {
  label: string;
  value: number;
  icon: string;
  iconColor: string;
  barColor: string;
  percentage?: number;
}

interface DashboardCard {
  value: string;
  label: string;
}

export function useDashboardData() {
  /**
   * Processa os métodos de pagamento agrupando-os em categorias
   */
  function processPaymentMethods(methods: Record<string, number>, totalPaid: number): PaymentMethod[] {
    const mainCategories = {
      card: {
        label: 'Cartão',
        value: 0,
        icon: 'card',
        iconColor: 'text-blue-400',
        barColor: 'bg-blue-500'
      },
      pix: {
        label: 'PIX',
        value: 0,
        icon: 'pix',
        iconColor: 'text-green-400',
        barColor: 'bg-green-500'
      },
      bank: {
        label: 'Boleto',
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

    const groupedMethods = Object.entries(methods).reduce((acc, [key, value]) => {
      const lowerKey = key.toLowerCase()
      let groupKey = 'other'
      let groupLabel = 'Outros'

      if (lowerKey.includes('credit') || lowerKey.includes('debit')) {
        groupKey = 'card'
        groupLabel = 'Cartão'
      } else if (lowerKey.includes('pix')) {
        groupKey = 'pix'
        groupLabel = 'PIX'
      } else if (lowerKey.includes('bank') || lowerKey.includes('payment_link')) {
        groupKey = 'bank'
        groupLabel = 'Boleto'
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
    }, {} as Record<string, PaymentMethod>)

    const finalMethods = {
      ...mainCategories,
      ...groupedMethods
    }

    return Object.entries(finalMethods).map(([key, method]) => ({
      ...method,
      percentage: totalPaid > 0 ? Math.round((method.value / totalPaid) * 100) : 0
    }))
  }

  /**
   * Processa os status de pagamento para formato adequado aos gráficos
   */
  function processPaymentStatus(status: Record<string, number>) {
    const statusLabels: Record<string, string> = {
      awaiting_payment: 'Aguardando Pagamento',
      paid: 'Pago',
      refunded: 'Reembolsado',
      cancelled: 'Cancelado',
      failed: 'Falhou'
    }

    return Object.entries(status).map(([key, value]) => ({
      label: statusLabels[key] || key,
      value: value
    }))
  }

  /**
   * Processa os dados dos cards do dashboard de acordo com o papel do usuário
   */
  function processDashboardCards(response: DashboardResponse, isManager: boolean): Record<string, DashboardCard> {
    if (isManager) {
      return {
        paid: {
          value: response.sales?.cards?.by_status?.paid?.toString() || '0',
          label: 'Vendas Pagas',
        },
        customers: {
          value: response.customers?.total?.toString() || '0',
          label: 'Total de Clientes',
        },
        withdrawals: {
          value: Object.values(response.withdrawals?.by_status || {}).reduce((a: number, b: number) => a + b, 0).toString(),
          label: 'Total de Saques',
        }
      }
    } else {
      return {
        paid: {
          value: response.sales?.cards?.by_status?.paid?.toString() || '0',
          label: 'Vendas Pagas',
        },
        customers: {
          value: response.customers?.total?.toString() || '0',
          label: 'Total de Clientes',
        },
        withdrawals: {
          value: response.sales?.cards?.by_status?.awaiting_payment?.toString() || '0',
          label: 'Aguardando Pagamento',
        }
      }
    }
  }

  /**
   * Processa os dados de saques para o formato adequado ao gráfico
   */
  function processWithdrawalsData(withdrawals: Record<string, number> | undefined) {
    return {
      data: [
        { label: 'Solicitado', value: withdrawals?.requested || 0 },
        { label: 'Aprovado', value: withdrawals?.approved || 0 },
        { label: 'Rejeitado', value: withdrawals?.rejected || 0 },
        { label: 'Em Processamento', value: withdrawals?.processing || 0 },
        { label: 'Concluído', value: withdrawals?.processed || 0 },
        { label: 'Cancelado', value: withdrawals?.cancelled || 0 },
        { label: 'Falha', value: withdrawals?.failed || 0 }
      ]
    }
  }

  return {
    processPaymentMethods,
    processPaymentStatus,
    processDashboardCards,
    processWithdrawalsData
  }
}