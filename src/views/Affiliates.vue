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
    BaseDropdown,
    BaseTable,
    CheckIcon,
    XIcon
  },
  setup(props) {
    const router = useRouter()
    const loading = ref(true)
    const affiliates = ref<Affiliate[]>([])
    const showCreateModal = ref(false)
    const showDetailsModal = ref(false)
    const selectedAffiliate = ref<Affiliate | null>(null)
    const searchQuery = ref('')

    const dropdownOptions = [
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

    // Adicionar watch para searchTerm
    watch(() => props.searchTerm, (newTerm) => {
      handleSearch(newTerm)
    })

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
        console.error('Erro ao carregar afiliados:', e)
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
        console.error('Erro ao pesquisar afiliados:', e)
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
      try {
        if (is_active) {
          await managerService.affiliates.approve(id);
        } else {
          await managerService.affiliates.block(id);
        }
        await loadAffiliates();
      } catch (e) {
        console.error('Erro ao alterar status do afiliado:', e);
      }
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
      dropdownOptions,
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

<template>
  <AuthenticatedLayout :loading="loading">

    <section class=" min-h-[944px] w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Afiliados</p>
        <BaseButton variant="primary" @click="openCreateModal">
          Novo Afiliado
        </BaseButton>
      </div>
      <div>
        <div v-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
          Nenhum afiliado encontrado.
        </div>
        <BaseTable :headers="[
          { key: 'name', label: 'Nome', align: 'left' },
          { key: 'id', label: 'ID de Afiliado', align: 'center' },
          { key: 'created_at', label: 'Data de cadastro', align: 'center' },
          { key: 'status', label: 'Status', align: 'center' },
          { key: 'actions', label: 'Ações', align: 'center' }
        ]" :items="affiliates">
          <template #name="{ item }">
            <div class="flex items-center gap-2">
              <img :src="`https://ui-avatars.com/api/?name=${item.name}&background=random`" :alt="item.name"
                class="w-8 h-w-8 rounded-full" />
              <p class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.name }}</p>
            </div>
          </template>

          <template #id="{ item }">
            <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ item.id }}</span>
          </template>

          <template #created_at="{ item }">
            {{ new Date(item.created_at).toLocaleDateString('pt-BR') }}
          </template>

          <template #status="{ item }">
            <span :class="getStatusClass(item.is_active ? 'Ativo' : 'Inativo')">
              {{ item.is_active ? 'Ativo' : 'Inativo' }}
            </span>
          </template>

          <template #actions="{ item }">
            <BaseDropdown :options="dropdownOptions" @select="handleAction($event, item.id)" :top="50" class="w-min mx-auto" />
          </template>
        </BaseTable>
      </div>
    </section>

    <!-- Modal de criação de afiliado -->
    <CreateAffiliateModal v-if="showCreateModal" @close="closeCreateModal" @submit="handleCreate" />
  </AuthenticatedLayout>
</template>


<style scoped>
/* Estilos específicos para Affiliates.vue */
</style>
