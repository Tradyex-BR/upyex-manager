<template>
  <div class="bg-[#040D25] overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <Sidebar />
      <main class="w-[81%] ml-5 max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <TopBar />
          <section class="bg-[#040D25] min-h-[944px] w-full overflow-hidden pt-8 pb-20 px-8 max-md:max-w-full max-md:px-5">
            <p class="text-white text-2xl font-semibold mb-6">Saques</p>
            <div class="overflow-x-auto">
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
                  <tr v-for="saque in saques" :key="saque.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ saque.data }}</td>
                    <td class="p-4">{{ saque.valorBRL }}</td>
                    <td class="p-4">{{ saque.destino }}</td>
                    <td class="p-4">{{ saque.tipo }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(saque.status)">{{ saque.status }}</span>
                    </td>
                    <td class="p-4">
                      <div class="relative">
                        <button 
                          @click="toggleDropdown(saque.id)"
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                        >
                          Ações
                        </button>
                        <div 
                          v-if="dropdownOpen === saque.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1A1F3C] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            @click="aprovar(saque.id)"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                          >
                            Aprovar
                          </button>
                          <button 
                            @click="rejeitar(saque.id)"
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

interface Saque {
  id: number;
  data: string;
  valorBRL: string;
  destino: string;
  tipo: string;
  status: string;
}

export default defineComponent({
  name: 'Saques',
  components: {
    Sidebar,
    TopBar
  },
  data() {
    return {
      store: useDashboardStore(),
      dropdownOpen: null as number | null
    }
  },
  computed: {
    saques(): Saque[] {
      return this.store.saques
    }
  },
  methods: {
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    getStatusClass(status: string): string {
      switch (status) {
        case 'Concluído':
          return 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500'
        case 'Recusado':
          return 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
        default:
          return 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500'
      }
    },
    async aprovar(id: number) {
      await this.store.aprovarSaque(id)
      this.dropdownOpen = null
    },
    async rejeitar(id: number) {
      await this.store.bloquearSaque(id)
      this.dropdownOpen = null
    }
  },
  mounted() {
    this.store.carregarSaques()
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