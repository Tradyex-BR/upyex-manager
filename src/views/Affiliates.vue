    <script lang="ts">
    import { defineComponent, ref, onMounted, watch, defineAsyncComponent } from 'vue'
    import { useRouter } from 'vue-router'
    import { managerService } from '@/services/managerService'
    import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
    import TopBar from '@/components/layout/dashboard/TopBar.vue'
    import BaseButton from '@/components/common/BaseButton.vue'
    import BaseModal from '@/components/common/BaseModal.vue'
    import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
    import CreateAffiliateModal from '@/components/affiliates/CreateAffiliateModal.vue'
    import MenuIcon from '@/components/icons/MenuIcon.vue'
    import BaseDropdown from '@/components/common/BaseDropdown.vue'
    import BaseTable from '@/components/common/BaseTable.vue'
    import { notificationService } from '@/services/notificationService'
    import { logger } from '@/config/logger'
    import BasePagination from '@/components/common/BasePagination.vue'
    import ToggleIcon from '@/components/icons/ToggleIcon.vue'
    import { getImageUrl, handleImageError } from '@/utils/imageUtils'
    import { usePaginationStore } from '@/stores/pagination'
    import { useDashboardStore } from '@/stores/dashboard'
    import { useAuthStore } from '@/stores/auth'
    import { useToast } from 'vue-toastification'

    const CheckIcon = defineAsyncComponent(() => import('@/components/icons/CheckIcon.vue'))
    const XIcon = defineAsyncComponent(() => import('@/components/icons/XIcon.vue'))

    interface Application {
      id: string;
      commission_percentage: number;
      commission_release_days: number;
    }

    interface Affiliate {
      id: string;
      name: string;
      email: string;
      integration_code: string;
      is_active: boolean;
      created_at: string;
      applications: Application[];
    }

    interface CreateForm {
      name: string;
      email: string;
      integration_code: string;
      applications: Application[];
    }

    export default defineComponent({
      props: {
        searchTerm: {
          type: String,
          default: ''
        }
      },
      name: 'Afiliados',
      components: {
        Sidebar,
        TopBar,
        AuthenticatedLayout,
        BaseModal,
        BaseButton,
        CreateAffiliateModal,
        MenuIcon,
        BaseDropdown,
        BaseTable,
        CheckIcon,
        XIcon,
        BasePagination,
        ToggleIcon
      },
      setup(props) {
        const store = useDashboardStore()
        const router = useRouter()
        const authStore = useAuthStore()
        const toast = useToast()
        const loading = ref(true)
        const affiliates = ref<Affiliate[]>([])
        const showCreateModal = ref(false)
        const showDetailsModal = ref(false)
        const selectedAffiliate = ref<Affiliate | null>(null)
        const createLoading = ref(false)
        const createError = ref('')
        const searchQuery = ref('')
        const paginationStore = usePaginationStore()
        const pagination = ref({
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: paginationStore.perPage,
          to: 1,
          total: 0
        })
        const createForm = ref<CreateForm>({
          name: '',
          email: '',
          integration_code: '',
          applications: [
            { id: '', commission_percentage: 0.2, commission_release_days: 7 }
          ]
        })

        const dropdownOptions = [
          {
            text: 'Ativar/Desativar',
            action: 'toggle_status',
            icon: ToggleIcon
          }
        ]

        watch(() => authStore.isAuthenticated, (isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            router.push('/login')
          }
        })

        watch(() => paginationStore.perPage, (newValue: number) => {
          pagination.value.per_page = newValue
          handleSearch(searchQuery.value, pagination.value.current_page)
        })

        const handleSearch = async (term: string, page: number = 1) => {
          loading.value = true
          try {
            const response = await managerService.affiliates.list({
              search: term,
              page: page,
              per_page: paginationStore.perPage,
              sort_by: 'created_at',
              sort_order: 'desc'
            })
            affiliates.value = response.data || []
            if (response.meta) {
              pagination.value = response.meta
            }
          } catch (e) {
            logger.error('Erro ao buscar afiliados:', e)
          } finally {
            loading.value = false
          }
        }

        const handlePageChange = async (newPage: number) => {
          await handleSearch(searchQuery.value, newPage)
        }

        const openCreateModal = () => {
          selectedAffiliate.value = null
          createForm.value = {
            name: '',
            email: '',
            integration_code: '',
            applications: [
              { id: '', commission_percentage: 0.2, commission_release_days: 7 }
            ]
          }
          createError.value = ''
          showCreateModal.value = true
        }

        const closeCreateModal = () => {
          showCreateModal.value = false
        }

        const openDetailsModal = (affiliate: Affiliate) => {
          selectedAffiliate.value = affiliate
          showDetailsModal.value = true
        }

        const closeDetailsModal = () => {
          showDetailsModal.value = false
        }

        const navigateToEdit = (affiliate: Affiliate) => {
          router.push(`/affiliates/${affiliate.id}/edit`)
        }

        const handleCreate = async (formData: any) => {
          try {
            createLoading.value = true
            await managerService.affiliates.create(formData)
            await handleSearch('')
            closeCreateModal()
            notificationService.success('Afiliado criado com sucesso')
          } catch (e) {
            logger.error('Erro ao criar afiliado:', e)
            createError.value = 'Erro ao criar afiliado. Por favor, tente novamente.'
            notificationService.error('Erro ao criar afiliado')
          } finally {
            createLoading.value = false
          }
        }

        const handleToggleStatus = async (id: string, is_active: boolean) => {
          try {
            if (is_active) {
              await managerService.affiliates.approve(id);
            } else {
              await managerService.affiliates.block(id);
            }
            await handleSearch('')
          } catch (e) {
            logger.error('Erro ao alterar status do afiliado:', e);
          }
        }

        const getStatusClass = (status: string) => {
          const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
          return status === 'Ativo'
            ? `${baseClass} bg-green-500/20 text-green-500`
            : `${baseClass} bg-red-500/20 text-red-500`
        }

        const handleAction = async (action: string, id: string) => {
          const affiliate = affiliates.value.find(a => a.id === id)
          if (!affiliate) return

          if (action === 'toggle_status') {
            await handleToggleStatus(id, !affiliate.is_active)
            notificationService.success('Status do afiliado alterado com sucesso')
          }
        }

        onMounted(() => {
          handleSearch('')
        })

        return {
          store,
          router,
          authStore,
          toast,
          loading,
          affiliates,
          showCreateModal,
          showDetailsModal,
          selectedAffiliate,
          createLoading,
          createError,
          searchQuery,
          pagination,
          createForm,
          dropdownOptions,
          openCreateModal,
          closeCreateModal,
          openDetailsModal,
          closeDetailsModal,
          navigateToEdit,
          handleCreate,
          handleToggleStatus,
          getStatusClass,
          handleAction,
          handlePageChange,
          getImageUrl,
          handleImageError
        }
      }
    })
</script>

    <template>
      <AuthenticatedLayout :loading="loading">
        <section class="w-full overflow-hidden">
          <div class="flex justify-between items-center mb-6">
            <p class="text-white text-2xl font-semibold">Afiliados</p>
            <BaseButton variant="primary" @click="openCreateModal">
              Novo Afiliado
            </BaseButton>
          </div>
          <div class="flex w-full justify-center text-gray-400">
            <div v-if="loading" class="flex items-center justify-center py-10">
              <span class="text-white text-lg">Carregando afiliados...</span>
            </div>
            <div v-else-if="affiliates.length === 0"
              class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
              Nenhum afiliado encontrado
            </div>
            <div v-else class="overflow-visible w-full">
              <BaseTable :headers="[
                { key: 'name', label: 'Nome', align: 'left' },
                { key: 'id', label: 'ID de Afiliado', align: 'center' },
                { key: 'created_at', label: 'Data de cadastro', align: 'center' },
                { key: 'updated_at', label: 'Última atualização', align: 'center' },
                { key: 'status', label: 'Status', align: 'center' },
                { key: 'actions', label: 'Ações', align: 'center' }
              ]" :items="affiliates">
                <template #name="{ item }">
                  <div class="flex items-center gap-2">
                    <img 
                      :src="getImageUrl(item.name)" 
                      :alt="item.name"
                      class="w-8 h-w-8 rounded-full"
                      @error="(e) => handleImageError(e, item.name)" 
                    />
                    <p class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.name }}</p>
                  </div>
                </template>

                <template #id="{ item }">
                  <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.integration_code
                  }}</span>
                </template>

                <template #created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}
                </template>

                <template #updated_at="{ item }">
                  {{ new Date(item.updated_at).toLocaleString('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  }) }}
                </template>

                <template #status="{ item }">
                  <span :class="getStatusClass(item.is_active ? 'Ativo' : 'Inativo')">
                    {{ item.is_active ? 'Ativo' : 'Inativo' }}
                  </span>
                </template>

                <template #actions="{ item }">
                  <BaseDropdown :options="dropdownOptions" @select="handleAction($event, item.id)" :top="50"
                    class="w-min mx-auto" />
                </template>
              </BaseTable>
            </div>
          </div>
        </section>
        <BasePagination :meta="pagination" @page-change="handlePageChange" />

        <!-- Modal de criação de afiliado -->
        <CreateAffiliateModal v-if="showCreateModal" @close="closeCreateModal" @submit="handleCreate"
          @refresh="handleSearch('', 1)" />
      </AuthenticatedLayout>
    </template>
