<template>
  <div class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <!-- Título e botão sempre visíveis -->
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Withdrawals</p>
              <BaseButton class="ml-2" @click="showRequestModal = true" v-if="role === 'affiliate'">
                Novo Saque
              </BaseButton>
            </div>

            <!-- Modais -->
            <WithdrawalRequestModal
              v-if="showRequestModal"
              @close="showRequestModal = false"
              @submit="handleWithdrawalRequest"
            />
            <WithdrawalSuccessModal
              v-if="showSuccessModal"
              @close="showSuccessModal = false"
            />

            <!-- Conteúdo condicional -->
            <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
              Carregando...
            </div>
            <div v-else-if="withdrawals.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
              Nenhum saque encontrado.
            </div>
            <div v-else>
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
                        <a v-if="withdrawal.link" :href="withdrawal.link" target="_blank" class="text-blue-400 underline mr-2">Detalhes</a>
                        <button 
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(withdrawal.id)"
                        >
                          Ações
                        </button>
                        <div 
                          v-if="dropdownOpen === withdrawal.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="aprovar(withdrawal.id)"
                          >
                            Aprovar
                          </button>
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                            @click="rejeitar(withdrawal.id)"
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

            <!-- Paginação -->
            <div v-if="pagination && pagination.links && pagination.links.length > 1" class="flex justify-center mt-6">
              <button
                v-for="link in pagination.links"
                :key="link.label"
                :disabled="!link.url"
                @click="goToPageByUrl(link.url)"
                :class="['mx-1 px-3 py-1 rounded', link.active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300', !link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800']"
                v-html="link.label"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import WithdrawalRequestModal from '@/components/withdrawals/WithdrawalRequestModal.vue'
import WithdrawalSuccessModal from '@/components/withdrawals/WithdrawalSuccessModal.vue'
import { managerService } from '@/services/managerService'

const loading = ref(true)
const withdrawalsSuccess = ref(false)

export default defineComponent({
  name: 'Withdrawals',
  components: {
    Sidebar,
    TopBar,
    BaseButton,
    WithdrawalRequestModal,
    WithdrawalSuccessModal
  },
  data() {
    const role  = localStorage.getItem('role')
    return {
      store: useDashboardStore(),
      dropdownOpen: null as number | null,
      showRequestModal: false,
      showSuccessModal: false,
      loading: true,
      withdrawals: [] as Array<any>,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        links: [] as Array<any>
      },
      role
    }
  },
  async mounted() {
    await this.loadWithdrawals();
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
  },
  methods: {
    async loadWithdrawals() {
      this.loading = true;
      try {
        const response = await managerService.withdrawals.list({
          start_date: '',
          end_date: '',
          status: null,
          method: null,
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        
        this.withdrawals = (response.data || []).map((item: any) => ({
          id: item.id,
          date: item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : '',
          valueBRL: Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          destination: item.destination,
          type: item.method,
          status: item.status,
          link: item.links?.frontend || ''
        }));

        if (response.meta) {
          this.pagination.current_page = response.meta.current_page;
          this.pagination.last_page = response.meta.last_page;
          this.pagination.per_page = response.meta.per_page;
          this.pagination.total = response.meta.total;
          this.pagination.links = response.meta.links;
        }
      } catch (error) {
        console.error('Erro ao carregar saques:', error);
      } finally {
        this.loading = false;
      }
    },
    async handleWithdrawalRequest({ amount, pixKey }: { amount: string, pixKey: string }) {
      try {
        await managerService.withdrawals.request({
          amount: Number(amount),
          pix_key: pixKey
        });
        this.showRequestModal = false;
        this.showSuccessModal = true;
        await this.loadWithdrawals(); // Recarrega a lista após o sucesso
      } catch (error) {
        console.error('Erro ao solicitar saque:', error);
        // Aqui você pode adicionar uma notificação de erro se desejar
      }
    },
    toggleDropdown(id: string) {
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
    async aprovar(id: string) {
      try {
        await managerService.withdrawals.approve(id);
        this.dropdownOpen = null;
        await this.loadWithdrawals(); // Recarrega a lista após a aprovação
      } catch (error) {
        console.error('Erro ao aprovar saque:', error);
      }
    },
    async rejeitar(id: string) {
      try {
        await managerService.withdrawals.reject(id);
        this.dropdownOpen = null;
        await this.loadWithdrawals(); // Recarrega a lista após a rejeição
      } catch (error) {
        console.error('Erro ao rejeitar saque:', error);
      }
    },
    goToPageByUrl(url: string) {
      // Extrai o número da página da URL e chama goToPage
      const match = url && url.match(/page=(\d+)/);
      if (match && match[1]) {
        this.goToPage(Number(match[1]));
      }
    },
    async goToPage(page: number) {
      if (page < 1 || page > this.pagination.last_page) return;
      this.pagination.current_page = page;
      this.loading = true;
      await this.loadWithdrawals();
    }
  }
})
</script> 