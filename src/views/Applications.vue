<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Aplicações</p>
        <BaseButton v-if="isManager" variant="primary" @click="showCreateModal = true">
          Nova Aplicação
        </BaseButton>
      </div>
      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando ofertas...</span>
        </div>
        <div v-else-if="offers.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhuma oferta encontrada
        </div>
        <div v-else class="overflow-visible w-full">
          <BaseTable :headers="isManager ? [
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'affiliate_count', label: 'Afiliados', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'base_affiliate_link', label: 'URL Base', align: 'center' },
            { key: 'actions', label: 'Ações', align: 'center' }
          ] : [
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'link', label: 'Link direto', align: 'center' }
          ]" :items="offers">
            <template #name="{ item }">
              <div class="flex items-center gap-3">
                <img :src="getImageUrl(item.name, item.logo_url)" :alt="item.name"
                  class="w-8 h-8 rounded-full object-cover" @error="(e) => handleImageError(e, item.name)" />
                <div class="flex flex-col">
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.name }}</span>
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.description
                  }}</span>
                </div>
              </div>
            </template>

            <template #affiliate_count="{ item }">
              <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.affiliate_count || 0 }}</span>
            </template>

            <template #status="{ item }">
              <span :class="getStatusClass(item.is_active)">
                {{ item.is_active ? 'Ativa' : 'Inativa' }}
              </span>
            </template>

            <template #base_affiliate_link="{ item }">
              <div v-if="item.base_affiliate_link" class="flex items-center justify-center gap-2">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                  {{ item.base_affiliate_link }}
                </span>
                <CopyButton v-if="item.base_affiliate_link" :stringToCopy="item.base_affiliate_link" :alt="isManager ? 'URL Base' : 'Link direto'" />
              </div>
              <div v-else class="flex items-center justify-center gap-2">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                  -
                </span>
              </div>
            </template>

            <template #link="{ item }">
              <div class="flex items-center justify-center gap-2">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                  {{ formatLink(item.affiliate_link) }}
                </span>
                <CopyButton v-if="item.affiliate_link" :stringToCopy="item.affiliate_link" :alt="isManager ? 'Link direto' : 'URL Base'" />
              </div>
            </template>

            <template #actions="{ item }">
              <BaseDropdown :options="dropdownOptions" :model-value="dropdownOpen === item.id"
                @update:model-value="(value) => handleDropdownToggle(item.id, value)"
                @select="(action) => handleApplicationAction(item.id, action)" :top="50" class="w-min mx-auto" />
            </template>
          </BaseTable>
        </div>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />

    <EditApplicationModal v-if="showEditModal" :show="showEditModal" :application-id="selectedApplication?.id"
      @close="showEditModal = false" @submit="handleEditApplication" />
    <ConfirmResetModal v-if="showResetModal" :show="showResetModal" :application-id="selectedApplication?.id"
      :api-key="selectedApplication?.api_secret" @close="showResetModal = false" @submit="handleResetApplication" />
    <CreateApplicationModal v-if="showCreateModal" :show="showCreateModal" @close="showCreateModal = false"
      @submit="handleCreateApplication" />
  </AuthenticatedLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { usePaginationStore } from '@/stores/pagination'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { managerService } from '@/services/managerService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CopyButton from '@/components/common/CopyButton.vue'
import { formatLink } from '@/utils/formatters'
import BaseTable from '@/components/common/BaseTable.vue'
import PenIcon from '@/components/icons/PenIcon.vue'
import KeyIcon from '@/components/icons/KeyIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import ToggleIcon from '@/components/icons/ToggleIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import EditApplicationModal from '@/components/applications/EditApplicationModal.vue'
import ConfirmResetModal from '@/components/applications/ConfirmResetModal.vue'
import CreateApplicationModal from '@/components/applications/CreateApplicationModal.vue'
import { notificationService } from '@/services/notificationService'
import { CONTEXT_ROLE_KEY } from '@/config/constants'
import { logger } from '@/config/logger'
import BasePagination from '@/components/common/BasePagination.vue'
import { getImageUrl, handleImageError } from '@/utils/imageUtils'

export default defineComponent({
  props: {
    searchTerm: {
      type: String,
      default: ''
    }
  },
  name: 'Applications',
  components: {
    AuthenticatedLayout,
    BaseButton,
    CopyButton,
    BaseTable,
    BaseDropdown,
    EditApplicationModal,
    ConfirmResetModal,
    CreateApplicationModal,
    BasePagination
  },
  setup() {
    const store = useDashboardStore()
    const loading = ref(true)
    const router = useRouter()
    const toast = useToast()
    const paginationStore = usePaginationStore()
    const dropdownOptions = [
      {
        text: 'Ativar/Desativar',
        action: 'toggle_status',
        icon: ToggleIcon
      },
      {
        text: 'Copiar Chave API',
        action: 'copy_api_key',
        icon: KeyIcon
      },
      {
        text: 'Editar Aplicação',
        action: 'edit_application',
        icon: PenIcon
      },
      {
        text: 'Resetar Chave API',
        action: 'reset_api_key',
        icon: TrashIcon
      }
    ]
    return { store, loading, router, toast, dropdownOptions, getImageUrl, handleImageError, paginationStore }
  },
  data() {
    return {
      offers: [] as any[],
      loading: true,
      showCreateModal: false,
      showEditModal: false,
      showResetModal: false,
      selectedApplication: null as any,
      isManager: false,
      dropdownOpen: null as string | null,
      pagination: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: 10,
        to: 1,
        total: 0,
        links: [] as Array<{ url: string | null; label: string; active: boolean }>
      }
    }
  },
  mounted() {
    this.isManager = localStorage.getItem(CONTEXT_ROLE_KEY) === 'manager'
  },
  watch: {
    'paginationStore.perPage': {
      handler(newValue: number) {
        this.pagination.per_page = newValue
        this.handleSearch(this.searchTerm)
      },
      immediate: true
    },
    searchTerm(newTerm) {
      this.handleSearch(newTerm)
    }
  },
  methods: {
    formatLink(link: string): string {
      return formatLink(link);
    },
    async handleSearch(term: string) {
      this.loading = true
      try {
        const response = await managerService.applications.list({
          search: term,
          page: 1,
          per_page: this.paginationStore.perPage,
          sort_by: 'name',
          sort_order: 'asc'
        })
        this.offers = response.data
        this.pagination = {
          current_page: response.meta.current_page,
          from: response.meta.from,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          to: response.meta.to,
          total: response.meta.total,
          links: response.meta.links
        }
      } catch (e) {
        logger.error('Erro ao buscar aplicações:', e)
        notificationService.error('Erro ao buscar aplicações')
      } finally {
        this.loading = false
      }
    },
    async handlePageChange(page: number) {
      this.loading = true
      try {
        const response = await managerService.applications.list({
          search: this.searchTerm,
          page: page,
          per_page: this.paginationStore.perPage,
          sort_by: 'name',
          sort_order: 'asc'
        })
        this.offers = response.data
        this.pagination = {
          current_page: response.meta.current_page,
          from: response.meta.from,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          to: response.meta.to,
          total: response.meta.total,
          links: response.meta.links
        }
      } catch (e) {
        logger.error('Erro ao buscar aplicações:', e)
        notificationService.error('Erro ao buscar aplicações')
      } finally {
        this.loading = false
      }
    },
    handleDropdownToggle(id: string, value: boolean) {
      this.dropdownOpen = value ? id : null;
    },
    async handleApplicationAction(id: string, action: string) {
      try {
        switch (action) {
          case 'toggle_status':
            try {
              const application = this.offers.find(o => o.id === id)
              if (!application) {
                throw new Error('Aplicação não encontrada')
              }

              const payload = {
                ...application,
                is_active: !application.is_active
              }

              await managerService.applications.update(id, payload)

              // Atualiza o estado local
              const index = this.offers.findIndex(o => o.id === id)
              if (index !== -1) {
                this.offers[index] = { ...this.offers[index], is_active: !application.is_active }
              }

              notificationService.success('Status atualizado com sucesso')
            } catch (error) {
              logger.error('Erro ao atualizar status:', error)
              notificationService.error('Erro ao atualizar status da aplicação')
            }
            break;
          case 'copy_api_key':
            try {
              const application = await managerService.applications.get(id)
              if (!application) {
                throw new Error('Aplicação não encontrada')
              }

              const apiSecret = application.api_secret
              if (!apiSecret) {
                throw new Error('Chave API não encontrada')
              }

              await navigator.clipboard.writeText(apiSecret)
              notificationService.success('Chave API copiada com sucesso')
            } catch (error) {
              logger.error('Erro ao copiar chave API:', error)
              notificationService.error('Erro ao copiar chave API')
            }
            break;
          case 'edit_application':
            this.selectedApplication = this.offers.find(o => o.id === id);
            this.showEditModal = true;
            break;
          case 'reset_api_key':
            this.selectedApplication = this.offers.find(o => o.id === id);
            this.showResetModal = true;
            break;
        }
      } catch (e) {
        logger.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    getStatusClass(isActive: boolean): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      return isActive
        ? `${baseClass} bg-green-500/20 text-green-500`
        : `${baseClass} bg-red-500/20 text-red-500`
    },
    async handleCreateApplication(createdApplication: any) {
      try {
        // Adiciona a nova aplicação à lista
        this.offers.unshift(createdApplication);
        this.showCreateModal = false;
      } catch (error) {
        logger.error('Erro ao criar aplicação:', error);
        notificationService.error('Erro ao criar aplicação');
      }
    },
    async handleEditApplication(formData: any) {
      try {
        const updatedApplication = await managerService.applications.update(this.selectedApplication.id, formData);

        // Atualiza o item localmente
        const index = this.offers.findIndex(o => o.id === this.selectedApplication.id);
        if (index !== -1) {
          this.offers[index] = { ...this.offers[index], ...updatedApplication };
        }

        this.showEditModal = false;
        notificationService.success('Aplicação atualizada com sucesso');
      } catch (error) {
        logger.error('Erro ao editar aplicação:', error);
        notificationService.error('Erro ao atualizar aplicação');
      }
    },
    async handleResetApplication() {
      try {
        await managerService.applications.resetSecret(this.selectedApplication.id)
        notificationService.success('Chave API resetada com sucesso')
      } catch (error) {
        logger.error('Erro ao resetar chave API:', error)
        notificationService.error('Erro ao resetar chave API')
      }
    },
    handleGenerateLink(offer: any) {
      this.selectedApplication = offer
      this.showCreateModal = true
    }
  }
})
</script>