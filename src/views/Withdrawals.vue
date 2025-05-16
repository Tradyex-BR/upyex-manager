<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import { logger } from '@/config/logger'
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
import BasePagination from '@/components/common/BasePagination.vue'
import { notificationService } from '@/services/notificationService'

import { ListWithdrawalsResponse } from '@/services/managerService'
import { CONTEXT_ROLE_KEY, PAGINATION } from '@/config/constants'

const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))
const XIcon = defineAsyncComponent(() => import('@/components/icons/XIcon.vue'))

// Dados mockados para testes
const MOCK_WITHDRAWALS: ListWithdrawalsResponse = {
  data: [],
  total: 0,
  page: 1,
  per_page: PAGINATION.DEFAULT_PAGE_SIZE,
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
    path: '',
    to: 1,
    total: 0,
    links: [],
    per_page: PAGINATION.DEFAULT_PAGE_SIZE
  }
}

// Flag para controlar se usa dados mockados
const USE_MOCK_DATA = false

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
    BaseTable,
    BasePagination,
    BaseModal: defineAsyncComponent(() => import('@/components/common/BaseModal.vue')),
    BaseInput: defineAsyncComponent(() => import('@/components/common/BaseInput.vue'))
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
        from: 1,
        to: 1,
        links: [] as Array<{ url: string | null; label: string; active: boolean }>
      },
      role,
      dropdownOptions: [
        {
          text: 'Aprovar',
          action: 'aprovar',
          icon: CheckIcon,
          role: 'manager'
        },
        {
          text: 'Bloquear',
          action: 'bloquear',
          icon: XIcon,
          role: 'manager'
        },
        {
          text: 'Cancelar',
          action: 'cancelar',
          icon: XIcon,
          role: 'affiliate'
        }
      ],
      withdrawalAmount: '',
      selectedMethod: '',
      destination: '',
      showModal: false
    }
  },
  computed: {
    filteredDropdownOptions() {
      if (!this.role) return []
      return this.dropdownOptions.filter(option => option.role === this.role)
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
          response = MOCK_WITHDRAWALS;
          logger.info('Dados de saques carregados:', response);
        } else {
          response = await managerService.withdrawals.list({
            start_date: '',
            end_date: '',
            status: null,
            method: null,
            page: this.pagination.current_page,
            per_page: 10,
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

        this.pagination = {
          current_page: response.meta.current_page,
          from: response.meta.from,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          to: response.meta.to,
          total: response.meta.total,
          links: response.meta.links
        };
      } catch (error) {
        logger.error('Erro ao carregar saques:', error);
        this.withdrawals = [];
        this.pagination = {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: PAGINATION.DEFAULT_PAGE_SIZE,
          to: 1,
          total: 0,
          links: []
        };
      } finally {
        this.loading = false;
      }
    },
    async handleSearch(term: string) {
      try {
        this.loading = true;
        const response = await managerService.withdrawals.list({
          start_date: '',
          end_date: '',
          status: null,
          method: null,
          page: 1,
          per_page: 10,
          sort_by: 'created_at',
          sort_order: 'desc',
          search: term
        });

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
        logger.error('Erro ao pesquisar saques:', error);
        this.withdrawals = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },
    async handleWithdrawalRequest(data: { amount: string, pixKey: string }) {
      try {
        this.lastWithdrawalAmount = data.amount;
        this.lastWithdrawalPixKey = data.pixKey;

        await managerService.withdrawals.request({
          amount: Number(this.lastWithdrawalAmount.replace(/[^0-9]/g, '')) / 100,
          method: 'pix',
          destination: this.lastWithdrawalPixKey
        });

        this.showRequestModal = false;
        this.showSuccessModal = true;
        await this.loadWithdrawals();
      } catch (error) {
        logger.error('Erro ao solicitar saque:', error);
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
    async handleAction(action: string, id: string) {
      try {
        if (action === 'aprovar') {
          logger.info('Aprovando saque:', id);
          await managerService.withdrawals.approve(id);
        } else if (action === 'bloquear') {
          logger.info('Rejeitando saque:', id);
          await managerService.withdrawals.reject(id);
        } else if (action === 'cancelar') {
          logger.info('Cancelando saque:', id);
          await managerService.withdrawals.cancel(id);
        }

        await this.loadWithdrawals();
      } catch (error) {
        logger.error('Erro ao executar ação no saque:', error);
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
      this.handleAction(action, id);
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
        logger.error('Erro ao carregar informações de saque:', error);
      }
    },
    async handlePageChange(page: number) {
      await this.goToPage(page);
    },
    async requestWithdrawal() {
      try {
        await managerService.withdrawals.request({
          amount: Number(this.withdrawalAmount),
          method: this.selectedMethod,
          destination: this.destination
        })
        notificationService.success('Saque solicitado com sucesso')
        this.showModal = false
      } catch (error) {
        logger.error('Erro ao solicitar saque:', error)
        notificationService.error('Erro ao solicitar saque')
      }
    }
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Saques</p>
        <BaseButton v-if="role === 'affiliate'" class="ml-2" @click="showRequestModal = true">
          Novo Saque
        </BaseButton>
      </div>

      <!-- Modais -->
      <WithdrawalRequestModal v-if="showRequestModal" @close="showRequestModal = false"
        @submit="handleWithdrawalRequest" :show-footer="false" :withdrawal-info="withdrawalInfo" />
      <WithdrawalSuccessModal v-if="showSuccessModal" :amount="lastWithdrawalAmount" :pix-key="lastWithdrawalPixKey"
        @close="showSuccessModal = false" :show-footer="false" />

      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando saques...</span>
        </div>
        <div v-else-if="withdrawals.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhum saque encontrado
        </div>
        <BaseTable v-else :headers="[
          { key: 'date', label: 'Data', align: 'left' },
          { key: 'value', label: 'Valor BRL', align: 'center' },
          { key: 'destination', label: 'Destino (Chave Pix)', align: 'center' },
          { key: 'type', label: 'Tipo', align: 'center' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'actions', label: 'Ações', align: 'center' }
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
            <BaseDropdown :options="filteredDropdownOptions" @select="handleDropdownAction($event, item.id)" :top="50"
              class="w-min mx-auto" />
          </template>
        </BaseTable>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />
  </AuthenticatedLayout>
</template>
