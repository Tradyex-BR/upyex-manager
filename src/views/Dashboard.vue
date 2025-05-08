<template>
  <AuthenticatedLayout :loading="loading">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Dashboard</p>
            </div>
            <div>
              <DashboardCards :data="data" :gap="24" :role="role" />
            </div>
            <DashboardNavigation v-model="currentView" />

            <div v-if="currentView === 'cards'" class="flex flex-col gap-6 mt-6">
              <GraphicSection title="Vendas diárias" description="Quantidade de vendas nos últimos 15 dias"
                class="min-h-[382px]">
                <CartesianAxes v-if="data.sales.graph.reduce((acc, curr) => acc + curr.count, 0) > 0"
                  :data="data.sales.graph" />
                <EmptyChart v-else center />
              </GraphicSection>

              <div class="grid grid-cols-2 gap-6 mb-8">
                <GraphicSection title="Status das vendas" description="Distribuição por status de pagamento"
                  class="min-h-[446px]">
                  <div v-if="totalStatusData > 0" class="flex gap-8 h-full justify-center items-center">
                    <DoughnutChart :data="formattedStatusData" />
                    <div class="flex flex-col gap-4">
                      <DoughnutChartLegends :data="formattedStatusData" />
                    </div>
                  </div>
                  <EmptyChart v-else center />
                </GraphicSection>
                <GraphicSection title="Método de pagamento" description="Distribuição por método de pagamento"
                  class="min-h-[446px]">
                  <PaymentMethodCards :data="formattedPaymentMethodData" class="w-full" />
                </GraphicSection>
              </div>
            </div>
            <div v-else-if="currentView === 'list'">
              <div class="flex flex-row gap-6" v-if="role === 'manager'">
                <GraphicSection title="Análise de clientes" description="Detalhes sobre base de clientes"
                  class="max-w-[352px] max-h-[382px] mt-6 flex flex-col">
                  <DashboardCards :data="data" border vertical class="flex-1 max-h-[116px]" :gap="8" />
                </GraphicSection>
                <GraphicSection title="Status dos saques" description="Distribuição dos status por saque"
                  class="w-full min-h-[382px] mt-6">
                  <BarChart v-if="totalWithdrawalsData > 0" :data="formattedWithdrawalsData" />
                  <EmptyChart v-else center />
                </GraphicSection>
              </div>
              <div class="flex flex-row gap-6" v-else>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue"
import DashboardNavigation from "@/components/layout/dashboard/DashboardNavigation.vue"
import CartesianAxes from "@/components/graphics/CartesianAxes.vue"
import DoughnutChart from "@/components/graphics/DoughnutChart.vue"
import DoughnutChartLegends from "@/components/graphics/DoughnutChartLegends.vue"
import PaymentMethodCards from "@/components/graphics/PaymentMethodCards.vue"
import GraphicSection from "@/components/graphics/GraphicSection.vue"
import { useDashboard } from '@/composables/useDashboard'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BarChart from "@/components/graphics/BarChart.vue"
import EmptyChart from '@/components/layout/dashboard/EmptyChart.vue'
const currentView = ref('cards')
const role = localStorage.getItem('contextRole') || 'manager'

const translateLabel = (label: string): string => {
  const translations: Record<string, string> = {
    // Status de pagamento
    'paid': 'Pago',
    'payment_pending': 'Pendente',
    'payment_failed': 'Falhou',
    'payment_refunded': 'Reembolsado',
    'payment_canceled': 'Cancelado',

    // Métodos de pagamento
    'credit_card': 'Cartão de Crédito',
    'pix': 'PIX',
    'bank_transfer': 'Transferência Bancária',
    'payment_link': 'Link de Pagamento',
    'debit_card': 'Cartão de Débito',
    'other': 'Outros',

    // Status de saque
    'completed': 'Concluído',
    'processing': 'Processando',
    'failed': 'Falhou',
    'pending': 'Pendente',
    'canceled': 'Cancelado',
    'approved': 'Aprovado',
    'rejected': 'Rejeitado',
    'requested': 'Solicitado',
    'processed': 'Processado',
    'cancelled': 'Cancelado',
  }

  return translations[label] || label
}

const {
  data,
  loading,
  fetchData,
} = useDashboard()

const totalStatusData = computed(() => Object.values(data.value?.sales?.cards?.by_status || {}).reduce((acc, curr) => acc + Number(curr), 0))
const totalWithdrawalsData = computed(() => Object.values(data.value?.withdrawals?.by_status || {}).reduce((acc, curr) => acc + Number(curr), 0))
const formattedStatusData = computed(() => ({
  data: Object.entries(data.value?.sales?.cards?.by_status || {}).map(([label, value]) => ({
    label,
    value: Number(value)
  }))
}))

const formattedPaymentMethodData = computed(() => {
  const methods = data.value?.sales?.cards?.by_payment_method || {}
  const totalPaid = Object.values(methods).reduce((acc, curr) => acc + Number(curr), 0)

  return {
    data: {
      methods: Object.entries(methods).map(([method, value]) => ({
        label: translateLabel(method),
        value: Number(value),
        icon: (method === 'credit_card' ? 'card' :
          method === 'pix' ? 'pix' :
            method === 'bank_transfer' ? 'bank' : 'other') as 'card' | 'pix' | 'bank' | 'other',
        iconColor: '#4A5C8A',
        barColor: 'bg-[#CF631C]'
      })),
      totalPaid
    }
  }
})

const formattedWithdrawalsData = computed(() => ({
  data: Object.entries(data.value?.withdrawals?.by_status || {}).map(([label, value]) => ({
    label: translateLabel(label),
    value: Number(value)
  }))
}))

onMounted(() => {
  fetchData()
})
</script>