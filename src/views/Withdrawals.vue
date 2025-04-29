<template>
  <div class=" overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
  <p class="text-white text-2xl font-semibold">Withdrawals</p>
  <BaseButton @click="" class="ml-2">
    Novo Saque
  </BaseButton>
</div>
            <div>
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Data</th>
                    <th class="p-4 text-left">Valor</th>
                    <th class="p-4 text-left">Destino</th>
                    <th class="p-4 text-left">Tipo</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="withdrawal in withdrawals" :key="withdrawal.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ withdrawal.date }}</td>
                    <td class="p-4">{{ withdrawal.valueBRL }}</td>
                    <td class="p-4">{{ withdrawal.destination }}</td>
                    <td class="p-4">{{ withdrawal.type }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(withdrawal.status)">{{ withdrawal.status }}</span>
                    </td>
                    <td class="p-4">
                      <div class="relative">
                        <button 
                          @click="toggleDropdown(withdrawal.id)"
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                        >
                          Ações
                        </button>
                        <div 
                          v-if="dropdownOpen === withdrawal.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            @click="aprovar(withdrawal.id)"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                          >
                            Aprovar
                          </button>
                          <button 
                            @click="rejeitar(withdrawal.id)"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

export default defineComponent({
  name: 'Withdrawals',
  components: {
    Sidebar,
    TopBar,
    BaseButton
  },
  data() {
    return {
      store: useDashboardStore(),
      dropdownOpen: null as number | null
    }
  },
  computed: {
    withdrawals() {
      return this.store.withdrawals
    }
  },
  methods: {
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    getStatusClass(status: string): string {
      switch (status) {
        case 'Completed':
          return 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500'
        case 'Rejected':
          return 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
        default:
          return 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500'
      }
    },
    async aprovar(id: number) {
      await this.store.approveWithdrawal(id)
      this.dropdownOpen = null
    },
    async rejeitar(id: number) {
      await this.store.blockWithdrawal(id)
      this.dropdownOpen = null
    }
  },
  mounted() {
    this.store.loadWithdrawals()
    // Fechar o dropdown quando clicar fora
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        this.dropdownOpen = null
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', () => {})
  }
})
</script> 