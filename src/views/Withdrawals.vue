<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import WithdrawalRequestModal from '@/components/withdrawals/WithdrawalRequestModal.vue'
import WithdrawalSuccessModal from '@/components/withdrawals/WithdrawalSuccessModal.vue'
import RedirectIcon from '@/components/icons/RedirectIcon.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseTable from '@/components/common/BaseTable.vue'

import { ListWithdrawalsResponse } from '@/services/managerService'
import { CONTEXT_ROLE_KEY, PAGINATION } from '@/config/constants'

const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))
const XIcon = defineAsyncComponent(() => import('@/components/icons/XIcon.vue'))

// Dados mockados para testes
const MANAGER_WITHDRAWALS: ListWithdrawalsResponse = {
  data: [
    {
      id: "01968d22-3ca1-72a3-afa3-297a68d90ddd",
      external_id: null,
      amount: "2684.11",
      status: "requested",
      method: "crypto",
      destination: "pipvhZsOvO7aIB2Ampi2BUixwCZ0yrwIkJBbQAzwdEu0",
      approved_at: null,
      rejected_at: null,
      processing_at: null,
      processed_at: null,
      cancelled_at: null,
      created_at: "2025-05-01T18:35:53.000000Z",
      updated_at: "2025-05-01T18:35:53.000000Z",
      links: {
        api: "http://board-api.upyex.test/api/manager/withdrawals/01968d22-3ca1-72a3-afa3-297a68d90ddd",
        frontend: "http://board.upyex.test/manager/withdrawals/01968d22-3ca1-72a3-afa3-297a68d90ddd"
      }
    }
  ],
  total: 1,
  page: 1,
  per_page: 20,
  links: {
    first: "http://board-api.upyex.test/api/manager/withdrawals?page=1",
    last: "http://board-api.upyex.test/api/manager/withdrawals?page=1",
    prev: null,
    next: null
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [
      {
        url: null,
        label: "&laquo; Anterior",
        active: false
      },
      {
        url: "http://board-api.upyex.test/api/manager/withdrawals?page=1",
        label: "1",
        active: true
      },
      {
        url: null,
        label: "Próximo &raquo;",
        active: false
      }
    ],
    path: "http://board-api.upyex.test/api/manager/withdrawals",
    per_page: 20,
    to: 1,
    total: 1
  }
}

const AFFILIATE_WITHDRAWALS: ListWithdrawalsResponse = {
  data: [
    {
      id: "01968d38-af8b-72c9-9259-d43a00ad8734",
      amount: "7672.54",
      status: "requested",
      method: "pix",
      destination: "65452036040",
      created_at: "2025-05-01T19:00:24.000000Z",
      updated_at: "2025-05-01T19:00:24.000000Z",
      links: {
        api: "http://board-api.upyex.test/api/affiliate/withdrawals/01968d38-af8b-72c9-9259-d43a00ad8734",
        frontend: "http://board.upyex.test/affiliate/withdrawals/01968d38-af8b-72c9-9259-d43a00ad8734"
      }
    }
  ],
  total: 1,
  page: 1,
  per_page: 20,
  links: {
    first: "http://board-api.upyex.test/api/affiliate/withdrawals?page=1",
    last: "http://board-api.upyex.test/api/affiliate/withdrawals?page=1",
    prev: null,
    next: null
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [
      {
        url: null,
        label: "&laquo; Anterior",
        active: false
      },
      {
        url: "http://board-api.upyex.test/api/affiliate/withdrawals?page=1",
        label: "1",
        active: true
      },
      {
        url: null,
        label: "Próximo &raquo;",
        active: false
      }
    ],
    path: "http://board-api.upyex.test/api/affiliate/withdrawals",
    per_page: 20,
    to: 1,
    total: 1
  }
}

// Flag para controlar se usa dados mockados
const USE_MOCK_DATA = true

export default defineComponent({
  name: 'Withdrawals',
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  components: {
    Sidebar,
    TopBar,
    BaseButton,
    AuthenticatedLayout,
    WithdrawalRequestModal,
    WithdrawalSuccessModal,
    RedirectIcon,
    MenuIcon,
    BaseDropdown,
    BaseTable
  },
  data() {
    const role = localStorage.getItem(CONTEXT_ROLE_KEY)
    return {
      store: useDashboardStore(),
      showRequestModal: false,
      showSuccessModal: false,
      lastWithdrawalAmount: '',
      lastWithdrawalPixKey: '',
      loading: true,
      withdrawalInfo: {
        minimum_amount: 0,
        maximum_amount: 0,
        daily_limit: 0,
        withdrawals_today: 0,
        current_balance: 0
      },
      withdrawals: [] as Array<any>,
      pagination: {
        current_page: 1,
        per_page: PAGINATION.DEFAULT_PAGE_SIZE,
        total: 0,
        last_page: 1,
        links: []
      },
      role,
      dropdownOptions: [
        {
          text: 'Aprovar',
          action: 'aprovar',
          icon: CheckIcon
        },
        {
          text: 'Bloquear',
          action: 'bloquear',
          icon: XIcon
        }
      ]
    }
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  },
  async mounted() {
    await this.loadWithdrawals();

    if (this.role === "affiliate") {
      await this.loadWithdrawalInfo();
    }
  },
  methods: {
    async loadWithdrawals() {
      try {
        this.loading = true;
        let response: ListWithdrawalsResponse;

        if (USE_MOCK_DATA) {
          response = this.role === "manager" ? MANAGER_WITHDRAWALS : AFFILIATE_WITHDRAWALS;
          console.log(response);
        } else {
          response = await managerService.withdrawals.list({
            start_date: '',
            end_date: '',
            status: null,
            method: null,
            page: this.pagination.current_page,
            per_page: this.pagination.per_page,
            sort_by: 'created_at',
            sort_order: 'desc'
          });
        }

        this.withdrawals = response.data.map((item) => ({
          id: item.id,
          date: item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : '',
          valueBRL: Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          destination: item.destination,
          type: item.method === 'pix' ? 'PIX' : item.method === 'crypto' ? 'Criptomoeda' : item.method,
          status: this.translateStatus(item.status),
          link: item.links?.frontend || ''
        }));

        this.pagination.current_page = response.page;
        this.pagination.last_page = Math.ceil(response.total / response.per_page);
        this.pagination.per_page = response.per_page;
        this.pagination.total = response.total;
        this.pagination.links = [];
      } catch (error) {
        console.error('Erro ao carregar saques:', error);
        this.withdrawals = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },
    async handleSearch(term: string) {
      try {
        let response: ListWithdrawalsResponse;

        if (USE_MOCK_DATA) {
          // Filtra os dados mockados
          const filteredData = this.role === "manager" ? MANAGER_WITHDRAWALS.data.filter(item =>
            item.destination.toLowerCase().includes(term.toLowerCase()) ||
            item.amount.toString().includes(term) ||
            this.translateStatus(item.status).toLowerCase().includes(term.toLowerCase())
          ) : AFFILIATE_WITHDRAWALS.data.filter(item =>
            item.destination.toLowerCase().includes(term.toLowerCase()) ||
            item.amount.toString().includes(term) ||
            this.translateStatus(item.status).toLowerCase().includes(term.toLowerCase())
          );
          response = {
            data: filteredData,
            total: filteredData.length,
            page: 1,
            per_page: this.pagination.per_page,
            links: {
              first: '',
              last: '',
              prev: null,
              next: null
            },
            meta: {
              current_page: 1,
              from: 1,
              last_page: 1,
              links: [],
              path: '',
              per_page: this.pagination.per_page,
              to: 1,
              total: filteredData.length
            }
          };
        } else {
          response = await managerService.withdrawals.list({
            search: term,
            start_date: '',
            end_date: '',
            status: null,
            method: null,
            page: 1,
            per_page: this.pagination.per_page,
            sort_by: 'created_at',
            sort_order: 'desc'
          });
        }

        this.withdrawals = response.data.map((item) => ({
          id: item.id,
          date: item.created_at ? new Date(item.created_at).toLocaleString('pt-BR') : '',
          valueBRL: Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          destination: item.destination,
          type: item.method === 'pix' ? 'PIX' : item.method === 'crypto' ? 'Criptomoeda' : item.method,
          status: this.translateStatus(item.status),
          link: item.links?.frontend || ''
        }));

        this.pagination.current_page = response.page;
        this.pagination.last_page = Math.ceil(response.total / response.per_page);
        this.pagination.per_page = response.per_page;
        this.pagination.total = response.total;
        this.pagination.links = [];
      } catch (error) {
        console.error('Erro ao pesquisar saques:', error);
      }
    },
    async handleWithdrawalRequest({ amount, pixKey }: { amount: string, pixKey: string }) {
      try {
        await managerService.withdrawals.request({
          amount: Number(amount),
          pix_key: pixKey
        });

        // Salva os dados do último saque para exibir na modal de sucesso
        this.lastWithdrawalAmount = amount;
        this.lastWithdrawalPixKey = pixKey;

        // Fecha a modal de solicitação e abre a modal de sucesso
        this.showRequestModal = false;
        this.showSuccessModal = true;

        // Recarrega a lista de saques
        await this.loadWithdrawals();
      } catch (error) {
        console.error('Erro ao solicitar saque:', error);
        // Aqui você pode adicionar uma notificação de erro se desejar
      }
    },
    getStatusClass(status: string): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      switch (status) {
        case 'Aprovado':
          return `${baseClass} bg-green-500/20 text-green-500`;
        case 'Rejeitado':
          return `${baseClass} bg-red-500/20 text-red-500`;
        case 'Processado':
          return `${baseClass} bg-green-500/20 text-green-500`;
        case 'Cancelado':
          return `${baseClass} bg-red-500/20 text-red-500`;
        case 'Processando':
          return `${baseClass} bg-blue-500/20 text-blue-500`;
        default: // Solicitação
          return `${baseClass} bg-yellow-500/20 text-yellow-500`;
      }
    },
    async aprovar(id: string) {
      try {
        console.log('aprovar', id);
        /* await this.loadWithdrawals(); */ // Recarrega a lista após a aprovação
      } catch (error) {
        console.error('Erro ao aprovar saque:', error);
      }
    },
    async rejeitar(id: string) {
      try {
        console.log('rejeitar', id);
        /*  await this.loadWithdrawals(); */ // Recarrega a lista após a rejeição
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
      await this.loadWithdrawals();
    },
    translateStatus(status: string): string {
      const statusMap: { [key: string]: string } = {
        'requested': 'Solicitado',
        'approved': 'Aprovado',
        'rejected': 'Rejeitado',
        'processing': 'Processando',
        'processed': 'Processado',
        'cancelled': 'Cancelado'
      };
      return statusMap[status] || status;
    },
    handleDropdownAction(action: string, id: string) {
      if (action === 'approve') {
        this.aprovar(id);
      } else if (action === 'reject') {
        this.rejeitar(id);
      }
    },
    async getBalance() {
      const response = await managerService.withdrawals.information();
      return Number(response.message) || 0;
    },
    async loadWithdrawalInfo() {
      try {
        const response = await managerService.withdrawals.information();
        this.withdrawalInfo = {
          minimum_amount: response.minimum_amount || 0,
          maximum_amount: response.maximum_amount || 0,
          daily_limit: response.daily_limit || 0,
          withdrawals_today: response.withdrawals_today || 0,
          current_balance: response.current_balance || 0
        };
      } catch (error) {
        console.error('Erro ao carregar informações de saque:', error);
      }
    }
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">
    <section class="min-h-[944px] w-full overflow-visible">
      <!-- Título e botão sempre visíveis -->
      <div class="flex justify-between items-center mb-6 overflow-visible">
        <p class="text-white text-2xl font-semibold">Saques</p>
        <BaseButton v-if="role === 'affiliate'" class="ml-2 " @click="showRequestModal = true">
          Novo Saque
        </BaseButton>
      </div>

      <!-- Modais -->
      <WithdrawalRequestModal v-if="showRequestModal" @close="showRequestModal = false"
        @submit="handleWithdrawalRequest" :show-footer="false" :withdrawal-info="withdrawalInfo" />
      <WithdrawalSuccessModal v-if="showSuccessModal" :amount="lastWithdrawalAmount" :pix-key="lastWithdrawalPixKey"
        @close="showSuccessModal = false" :show-footer="false" />

      <!-- Conteúdo condicional -->
      <div class="flex w-full min-h-[calc(100vh-200px)] justify-center text-gray-400">
        <div v-if="withdrawals.length === 0"
          class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
          Nenhum saque encontrado
        </div>
        <div v-else class="w-full">
          <BaseTable :headers="[
            { key: 'date', label: 'Data', align: 'left' },
            { key: 'value', label: 'Valor BRL', align: 'center' },
            { key: 'destination', label: 'Destino (Chave Pix)', align: 'center' },
            { key: 'type', label: 'Tipo', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'actions', label: role === 'manager' ? 'Ações' : 'Link', align: 'center' }
          ]" :items="withdrawals">
            <template #date="{ item }">
              {{ item.date }}
            </template>

            <template #value="{ item }">
              {{ item.valueBRL }}
            </template>

            <template #destination="{ item }">
              {{ item.destination }}
            </template>

            <template #type="{ item }">
              {{ item.type }}
            </template>

            <template #status="{ item }">
              <span :class="getStatusClass(item.status)">{{ item.status }}</span>
            </template>

            <template #actions="{ item }">
              <template v-if="role === 'manager'">
                <BaseDropdown :options="dropdownOptions" @select="handleDropdownAction($event, item.id)" :top="50"
                  class="w-min mx-auto" />
              </template>
              <template v-else>
                <a v-if="item.link" :href="item.link" target="_blank" class="flex items-center justify-center">
                  <RedirectIcon />
                </a>
              </template>
            </template>
          </BaseTable>
        </div>
      </div>

      <!-- Paginação -->
      <!--  <div v-if="pagination && pagination.links && pagination.links.length > 1" class="flex justify-center mt-6">
                <button
                  v-for="link in pagination.links"
                  :key="link.label"
                  :disabled="!link.url"
                  @click="goToPageByUrl(link.url)"
                  :class="['mx-1 px-3 py-1 rounded', link.active ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300', !link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800']"
                  v-html="link.label"
                />
              </div> -->
    </section>
  </AuthenticatedLayout>
</template>
