<template>
  <AuthenticatedLayout :loading="loading">

    <section class=" min-h-[944px] w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Afiliados</p>
        <BaseButton
          variant="primary"
          @click="openCreateModal">
          Novo Afiliado
        </BaseButton>
      </div>
      <div>
        <div v-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
          Nenhum afiliado encontrado.
        </div>
        <table v-else class="w-full text-white border-collapse">
          <thead>
            <tr class="bg-[#1A1F3C]">
              <th class="p-4 text-left font-inter text-[14px] font-medium leading-[18px] text-white">Nome</th>
              <th class="p-4 text-center font-inter text-[14px] font-medium leading-[18px] text-white">ID de Afiliado
              </th>
              <th class="p-4 text-center font-inter text-[14px] font-medium leading-[18px] text-white">Data de cadastro
              </th>
              <th class="p-4 text-center font-inter text-[14px] font-medium leading-[18px] text-white">Status</th>
              <th class="p-4 text-center font-inter text-[14px] font-medium leading-[18px] text-white">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="affiliate in affiliates" :key="affiliate.id" class="border-b border-[#1A1F3C]">
              <td class="p-4 flex items-center gap-2">
                <img :src="`https://ui-avatars.com/api/?name=${affiliate.name}&background=random`" :alt="affiliate.name"
                  class="w-8 h-w-8 rounded-full" />
                <p class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ affiliate.name }}</p>
              </td>
              <td class="p-4 text-center">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ affiliate.id }}</span>
              </td>
              <td class="p-4 text-center font-inter text-[14px] font-normal leading-[18px] text-white">{{ new
                Date(affiliate.created_at).toLocaleDateString('pt-BR') }}</td>
              <td class="p-4 text-center">
                <span :class="getStatusClass(affiliate.is_active ? 'Ativo' : 'Inativo')">
                  {{ affiliate.is_active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="p-4 text-center flex items-center justify-center">
                <BaseDropdown
                  :options="[
                    {
                      text: 'Aprovar',
                      action: 'aprovar',
                      icon: 'fas fa-check-circle'
                    },
                    {
                      text: 'Bloquear',
                      action: 'bloquear',
                      icon: 'fas fa-ban'
                    }
                  ]"
                  @select="handleAction($event, affiliate.id)"
                  :top="50"
                  class="w-min"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal de criação de afiliado -->
    <CreateAffiliateModal v-if="showCreateModal" @close="closeCreateModal" @submit="handleCreate" />
  </AuthenticatedLayout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import CreateAffiliateModal from '@/components/affiliates/CreateAffiliateModal.vue'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'

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

interface EditForm {
  name: string;
  email: string;
  integration_code: string;
  is_active: boolean;
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
    BaseDropdown
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const loading = ref(true)
    const affiliates = ref([])
    const showCreateModal = ref(false)
    const showDetailsModal = ref(false)
    const selectedAffiliate = ref(null)
    const searchQuery = ref('')

    const loadAffiliates = async () => {
      try {
        const response = await managerService.affiliates.list({
          search: '',
          page: 1,
          per_page: 20,
          sort_by: 'name',
          sort_order: 'asc'
        });
        affiliates.value = (response.data || response) as Affiliate[];
      } catch (e) {
        // Trate erro se necessário
      } finally {
        loading.value = false;
      }
    }

    const handleSearch = async (term: string) => {
      loading.value = true;
      try {
        const response = await managerService.affiliates.list({
          search: term,
          page: 1,
          per_page: 20,
          sort_by: 'name',
          sort_order: 'asc'
        });
        affiliates.value = (response.data || response) as Affiliate[];
      } catch (e) {
        // Trate erro se necessário
      } finally {
        loading.value = false;
      }
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
        await managerService.affiliates.create(formData)
        await handleSearch('')
        closeCreateModal()
      } catch (e) {
        console.error('Erro ao criar afiliado:', e)
      }
    }

    const handleToggleStatus = async (id: string, is_active: boolean) => {
      await store.blockAffiliate(id)
    }

    const handleResetSecret = () => {
      // Implemente a lógica para resetar o segredo do afiliado
    }

    const handleEditApplications = () => {
      // Implemente a lógica para editar as aplicações do afiliado
    }

    const createLoading = ref(false)
    const createError = ref('')
    const editLoading = ref(false)
    const editError = ref('')
    const editForm = ref({
      name: '',
      email: '',
      integration_code: '',
      is_active: true,
      applications: []
    } as EditForm)
    const createForm = ref({
      name: '',
      email: '',
      integration_code: '',
      applications: [
        { id: '', commission_percentage: 0.2, commission_release_days: 7 }
      ]
    } as CreateForm)

    const removeApp = (idx: number) => {
      createForm.value.applications.splice(idx, 1)
    }

    const addApp = () => {
      createForm.value.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
    }

    const saveAffiliateEdits = async () => {
      if (!selectedAffiliate.value) return
      editLoading.value = true
      editError.value = ''
      try {
        await managerService.affiliates.update(selectedAffiliate.value.id, editForm.value)
        const idx = affiliates.value.findIndex(a => a.id === selectedAffiliate.value?.id)
        if (idx !== -1 && selectedAffiliate.value) {
          affiliates.value[idx] = { ...selectedAffiliate.value, ...editForm.value }
        }
        closeDetailsModal()
      } catch (e) {
        editError.value = 'Erro ao atualizar afiliado.'
      } finally {
        editLoading.value = false
      }
    }

    const removeEditApp = (idx: number) => {
      editForm.value.applications.splice(idx, 1)
    }

    const addEditApp = () => {
      editForm.value.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
    }

    const getStatusClass = (status: string): string => {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      const statusMap: { [key: string]: string } = {
        'Ativo': `${baseClass} bg-green-500/20 text-green-500`,
        'Inativo': `${baseClass} bg-red-500/20 text-red-500`,
        'Bloqueado': `${baseClass} bg-red-500/20 text-red-500`
      }
      return statusMap[status] || `${baseClass} bg-gray-500/20 text-gray-500`
    }

    const handleAction = async (action: string, id: string) => {
      try {
        switch (action) {
          case 'aprovar':
            await managerService.affiliates.approve(id);
            await loadAffiliates();
            break;
          case 'bloquear':
            await managerService.affiliates.block(id);
            await loadAffiliates();
            break;
        }
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e);
      }
    }

    onMounted(loadAffiliates)

    return {
      loading,
      affiliates,
      showCreateModal,
      showDetailsModal,
      selectedAffiliate,
      searchQuery,
      loadAffiliates,
      handleSearch,
      openCreateModal,
      closeCreateModal,
      openDetailsModal,
      closeDetailsModal,
      navigateToEdit,
      handleCreate,
      handleToggleStatus,
      handleResetSecret,
      handleEditApplications,
      createLoading,
      createError,
      editLoading,
      editError,
      editForm,
      createForm,
      removeApp,
      addApp,
      saveAffiliateEdits,
      removeEditApp,
      addEditApp,
      getStatusClass,
      handleAction
    }
  }
})
</script>

<style scoped>
/* Estilos específicos para Affiliates.vue */
</style>
