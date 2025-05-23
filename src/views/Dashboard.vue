<template>
  <AuthenticatedLayout :loading="loading">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Dashboard</p>
              <div class="flex items-center gap-4">
                <div class="relative flex items-center">
                  <flat-pickr
                    v-model="dateRange"
                    :config="flatpickrOptions"
                    class="bg-[#222a3f] border border-[#222a3f] cursor-pointer rounded-lg px-4 py-2 text-white w-[255px] focus:outline-none focus:ring-0 pr-10"
                    placeholder="Selecione o período (DD/MM/AAAA)"
                  />
                  <svg class="absolute right-3 w-5 h-5 text-[#CF631C] pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <DashboardCards :data="data" :gap="24" :role="role" :isValueCurrency="true" />
            </div>
            <DashboardNavigation v-model="currentView" />

            <div v-if="currentView === 'cards'" class="flex flex-col gap-6 mt-6">
              <GraphicSection title="Vendas diárias" description="Quantidade de vendas nos últimos 15 dias"
                class="min-h-[382px]">
                <CartesianAxes v-if="data.sales.graph.reduce((acc, curr) => acc + curr.count, 0) > 0"
                  :data="data.sales.graph" />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <EmptyChart />
                </div>
              </GraphicSection>

              <div class="grid grid-cols-2 gap-6">
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
                  <template #actions>
                    <BaseDropdown :options="dropdownOptions" @select="handleDropdownAction" :top="50"
                      class="w-min mx-auto" v-model="isDropdownOpen">
                      <template #trigger>
                        <div
                          class="w-[120px] flex items-center justify-between gap-[15px] rounded-lg border border-[#2C3652] p-3">
                          <p class="w-[80px] text-start text-white font-inter leading-5">{{ currentDropdownAction }}</p>
                          <svg :class="['w-5 h-5 transition-transform', { 'rotate-180': isDropdownOpen }]"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M4.41074 6.9107C4.73618 6.58527 5.26382 6.58527 5.58926 6.9107L10 11.3214L14.4107 6.9107C14.7362 6.58527 15.2638 6.58527 15.5893 6.9107C15.9147 7.23614 15.9147 7.76378 15.5893 8.08921L10.5893 13.0892C10.2638 13.4146 9.73618 13.4146 9.41075 13.0892L4.41074 8.08921C4.08531 7.76378 4.08531 7.23614 4.41074 6.9107Z"
                              fill="#4D5E8F" />
                          </svg>
                        </div>
                      </template>
                    </BaseDropdown>
                  </template>
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
import { ref, onMounted, computed } from 'vue'
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
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import { CONTEXT_ROLE_KEY } from '@/config/constants'
import { logger } from '@/config/logger'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/themes/dark.css'

const currentView = ref('cards')
const role = localStorage.getItem(CONTEXT_ROLE_KEY) || 'manager'
const currentDropdownAction = ref('Total')
const isDropdownOpen = ref(false)
const dateRange = ref('')

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

const dropdownOptions = computed(() => [
  {
    text: 'Total',
    action: 'total'

  },
  {
    text: 'Pagos',
    action: 'paid'
  },
])

const flatpickrOptions = {
  mode: 'range' as const,
  dateFormat: 'd/m/Y',
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as [string, string, string, string, string, string, string],
      longhand: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as [string, string, string, string, string, string, string]
    },
    months: {
      shorthand: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as [string, string, string, string, string, string, string, string, string, string, string, string],
      longhand: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'] as [string, string, string, string, string, string, string, string, string, string, string, string]
    },
    rangeSeparator: ' até ',
    weekAbbreviation: 'Sem',
    amPM: ['AM', 'PM'] as [string, string],
    yearAriaLabel: 'Ano',
    monthAriaLabel: 'Mês',
    hourAriaLabel: 'Hora',
    minuteAriaLabel: 'Minuto',
    time_24hr: false
  },
  defaultDate: [new Date().setDate(new Date().getDate() - 7), new Date()],
  onChange: (selectedDates: Date[]) => {
    if (selectedDates.length === 2) {
      const startDate = selectedDates[0].toISOString().split('T')[0]
      const endDate = selectedDates[1].toISOString().split('T')[0]
      fetchData(undefined, { start_date: startDate, end_date: endDate })
    }
  }
}

onMounted(() => {
  if (currentDropdownAction.value === 'Total') {
    fetchData()
  } else {
    fetchData(currentDropdownAction.value)
  }
})

const handleDropdownAction = (action: string) => {
  logger.info('Ação selecionada:', action)
  // Aqui você pode implementar a lógica para cada ação
  switch (action) {
    case 'total':
      currentDropdownAction.value = 'Total'
      fetchData()
      break
    case 'paid':
      currentDropdownAction.value = 'Pagos'
      fetchData(currentDropdownAction.value)
      break
  }
}
</script>