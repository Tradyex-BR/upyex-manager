  <template>
    <AuthenticatedLayout :loading="loading">
      <div v-if="loading" class="flex items-center justify-center py-10">
        <span class="text-white text-lg">Carregando ofertas...</span>
      </div>
      <div v-else-if="offers.length === 0"
        class="flex w-full min-h-[200px] items-center justify-center text-gray-400 text-lg">
        Nenhuma oferta encontrada
      </div>
      <div v-else class="overflow-visible">
        <section class="min-h-[944px] w-full overflow-visible">
          <div class="flex justify-between items-center mb-6">
            <p class="text-white text-2xl font-semibold">Aplicações</p>
          </div>
          <div>

            <BaseTable :headers="isManager ? [
              { key: 'name', label: 'Nome', align: 'left' },
              { key: 'status', label: 'Status', align: 'center' },
              { key: 'base_affiliate_link', label: 'Link direto', align: 'center' },
              { key: 'actions', label: 'Ações', align: 'center' }
            ] : [
              { key: 'name', label: 'Nome', align: 'left' },
              { key: 'status', label: 'Status', align: 'center' },
              { key: 'link', label: 'Link direto', align: 'center' }
            ]" :items="offers">
              <template #name="{ item }">
                <div class="flex items-center gap-3">
                  <img :src="item.logo_url || `https://ui-avatars.com/api/?name=${item.name}&background=random`"
                    :alt="item.name" class="w-8 h-8 rounded-full object-cover" />
                  <div class="flex flex-col">
                    <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.name }}</span>
                    <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.description
                    }}</span>
                  </div>
                </div>
              </template>

              <template #status="{ item }">
                <span :class="getStatusClass(item.is_active)">
                  {{ item.is_active ? 'Ativa' : 'Inativa' }}
                </span>
              </template>

              <template #base_affiliate_link="{ item }">
                <div class="flex items-center justify-center gap-2">
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                    {{ item.base_affiliate_link }}
                  </span>
                  <CopyButton :stringToCopy="item.base_affiliate_link" />
                </div>
              </template>

              <template #link="{ item }">
                <div class="flex items-center justify-center gap-2">
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white truncate max-w-[200px]">
                    {{ formatLink(item.affiliate_link) }}
                  </span>
                  <CopyButton :stringToCopy="item.affiliate_link" />
                </div>
              </template>

              <template #actions="{ item }">
                <BaseDropdown :options="dropdownOptions" :model-value="dropdownOpen === item.id"
                  @update:model-value="(value) => handleDropdownToggle(item.id, value)"
                  @select="(action) => handleApplicationAction(item.id, action)" :top="50" class="w-min mx-auto" />
              </template>
            </BaseTable>
          </div>
        </section>
      </div>

      <EditApplicationModal v-if="showEditModal" :show="showEditModal" :application-id="selectedApplication?.id"
        @close="showEditModal = false" @submit="handleEditApplication" />
      <ConfirmResetModal v-if="showResetModal" :show="showResetModal" :application-id="selectedApplication?.id"
        :api-key="selectedApplication?.api_secret" @close="showResetModal = false" @submit="handleResetApplication" />
    </AuthenticatedLayout>
  </template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { managerService } from '@/services/managerService'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CopyButton from '@/components/common/CopyButton.vue'
import { formatLink } from '@/utils/formatters'
import BaseTable from '@/components/common/BaseTable.vue'
import XIcon from '@/components/icons/XIcon.vue'
import PenIcon from '@/components/icons/PenIcon.vue'
import KeyIcon from '@/components/icons/KeyIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import EditApplicationModal from '@/components/applications/EditApplicationModal.vue'
import ConfirmResetModal from '@/components/applications/ConfirmResetModal.vue'
import { notificationService } from '@/services/notificationService'
import { CONTEXT_ROLE_KEY } from '@/config/constants'

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
    ConfirmResetModal
  },
  setup() {
    const store = useDashboardStore()
    const loading = ref(true)
    const router = useRouter()
    const toast = useToast()
    const dropdownOptions = [
      {
        text: 'Ativar/Desativar',
        action: 'toggle_status',
        icon: XIcon
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
    return { store, loading, router, toast, dropdownOptions }
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
      dropdownOpen: null as string | null
    }
  },
  async mounted() {
    this.isManager = localStorage.getItem(CONTEXT_ROLE_KEY) === 'manager'
    await this.handleSearch('');
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  },
  methods: {
    formatLink(link: string): string {
      return formatLink(link);
    },
    async handleSearch(term: string) {
      this.loading = true;
      try {
        const response = await managerService.applications.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        this.offers = response.data;
      } catch (e) {
        // Trate erro se necessário
      } finally {
        this.loading = false;
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
              console.error('Erro ao atualizar status:', error)
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
              console.error('Erro ao copiar chave API:', error)
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
        console.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    getStatusClass(isActive: boolean): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      return isActive
        ? `${baseClass} bg-green-500/20 text-green-500`
        : `${baseClass} bg-red-500/20 text-red-500`
    },
    async handleCreateApplication(formData: any) {
      try {
        await managerService.applications.create(formData);
        await this.handleSearch('');
        this.showCreateModal = false;
      } catch (error) {
        console.error('Erro ao criar aplicação:', error);
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
        console.error('Erro ao editar aplicação:', error);
        notificationService.error('Erro ao atualizar aplicação');
      }
    },
    async handleResetApplication() {
      try {
        await managerService.applications.resetSecret(this.selectedApplication.id)
        notificationService.success('Chave API resetada com sucesso')
      } catch (error) {
        console.error('Erro ao resetar chave API:', error)
        notificationService.error('Erro ao resetar chave API')
      }
    },
    async loadOffers() {
      await this.handleSearch('');
    },
    handleGenerateLink(offer: any) {
      this.selectedApplication = offer
      this.showCreateModal = true
    }
  }
})
</script>