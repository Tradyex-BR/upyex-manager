<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <p class="text-white text-2xl font-semibold mb-6">Affiliates</p>
            <div>
              <div v-if="loading" class="flex items-center justify-center py-10">
                <span class="text-white text-lg">Carregando afiliados...</span>
              </div>
              <table v-else class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Nome</th>
                    <!-- <th class="p-4 text-left">E-mail</th>
 -->
                    <th class="p-4 text-left">Código de Integração</th>
                    <th class="p-4 text-left">Data de Cadastro</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="affiliate in affiliates" :key="affiliate.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4 flex items-center gap-2">
                      <img
:src="`https://ui-avatars.com/api/?name=${affiliate.name}&background=random`"
                        :alt="affiliate.name" class="w-10 h-10 rounded-full" />
                      <p class="text-white text-sm font-semibold">{{ affiliate.name }}</p>
                    </td>
                    <!--   <td class="p-4">{{ affiliate.email }}</td>
 -->
                    <td class="p-4">{{ affiliate.integration_code }}</td>
                    <td class="p-4">{{ new Date(affiliate.created_at).toLocaleDateString() }}</td>
                    <td class="p-4">
                      <span
                        :class="affiliate.is_active ? 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500' : 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'">
                        {{ affiliate.is_active ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="relative">
                        <button
class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(affiliate.id)">
                          Ações
                        </button>
                        <div
v-if="dropdownOpen === affiliate.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button
class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="handleAction(affiliate.id, 'aprovar')">
                            Aprovar
                          </button>
                          <button
class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-yellow-500"
                            @click="handleAction(affiliate.id, 'bloquear')">
                            Bloquear
                          </button>
                          <button
class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                            @click="handleAction(affiliate.id, 'excluir')">
                            Excluir
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
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'

export default defineComponent({
  name: 'Vendas',
  components: {
    Sidebar,
    TopBar
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  },
  data() {
    return {
      affiliates: [] as any[],
      dropdownOpen: null as number | null,
      loading: true
    }
  },
  async mounted() {
    try {
      const response = await managerService.affiliates.list({
  search: '',
  page: 1,
  per_page: 20,
  sort_by: 'name',
  sort_order: 'asc'
});
      this.affiliates = response.data || response; // ajuste conforme o retorno real
    } catch (e) {
      // Trate erro se necessário
    } finally {
      this.loading = false;
    }
    // Fechar o dropdown quando clicar fora
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        this.dropdownOpen = null
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', () => { })
  },
  methods: {
    getStatusClass(status: string): string {
      const classes = {
        'Aprovado': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Pendente': 'px-2 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-500',
        'Rejeitado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleAction(id: number, action: string) {
      switch (action) {
        case 'aprovar':
          await this.store.approveAffiliate(id)
          break
        case 'bloquear':
          await this.store.blockAffiliate(id)
          break
        case 'excluir':
          await this.store.deleteAffiliate(id)
          break
      }
      this.dropdownOpen = null
    }
  }
})
</script>