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
                <CartesianAxes :data="data.sales.graph" />
              </GraphicSection>

              <div class="grid grid-cols-2 gap-6 mb-8">
                <GraphicSection title="Status das vendas" description="Distribuição por status de pagamento"
                  class="h-[446px]">
                  <div class="flex gap-8 h-full justify-center items-center">
                    <DoughnutChart :data="formattedStatusData" />
                    <div class="flex flex-col gap-4">
                      <DoughnutChartLegends :data="formattedStatusData" />
                    </div>
                  </div>
                </GraphicSection>
                <GraphicSection title="Método de pagamento" description="Distribuição por método de pagamento"
                  class="h-[446px]">
                  <PaymentMethodCards :data="formattedPaymentMethodData" />
                </GraphicSection>
              </div>
            </div>
            <div v-else-if="currentView === 'list'">
              <div class="flex flex-row gap-6" v-if="role === 'manager'">
                <GraphicSection title="Análise de clientes" description="Detalhes sobre base de clientes"
                  class="max-w-[352px] max-h-[382px] mt-6 flex flex-col">
                  <DashboardCards :data="data" border vertical
                    class="flex-1 max-h-[116px]" :gap="8" />
                </GraphicSection>
                <GraphicSection title="Status dos saques" description="Distribuição dos status por saque"
                  class="w-full h-[382px] mt-6">
                  <BarChart :data="formattedWithdrawalsData" />
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
const currentView = ref('cards')
const role = localStorage.getItem('role') || 'manager'

const {
  data,
  loading,
  fetchData,
} = useDashboard()

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
        label: method,
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
    label,
    value: Number(value)
  }))
}))

onMounted(() => {
  fetchData()
})

watch(data, () => {
  console.log('Withdrawals Data:', formattedWithdrawalsData.value)
})
</script>