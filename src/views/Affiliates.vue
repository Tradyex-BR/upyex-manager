<template>
  <AuthenticatedLayout :loading="loading">

    <section class=" min-h-[944px] w-full overflow-visible">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Afiliados</p>
        <BaseButton @click="openCreateModal"
          class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
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
                  class="w-10 h-10 rounded-full" />
                <p class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ affiliate.name }}</p>
              </td>
              <td class="p-4 text-center">
                <span class="font-inter text-[14px] font-normal leading-[18px] text-white">{{ affiliate.id }}</span>
              </td>
              <td class="p-4 text-center font-inter text-[14px] font-normal leading-[18px] text-white">{{ new
                Date(affiliate.created_at).toLocaleDateString('pt-BR') }}</td>
              <td class="p-4 text-center">
                <span
                  :class="affiliate.is_active ? 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500' : 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'">
                  {{ affiliate.is_active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="p-4 text-center">
                <div class="relative">
                  <button
                    class="outline-none border-none bg-transparent p-0"
                    @click="toggleDropdown(affiliate.id)">
                    <MenuIcon />
                  </button>
                  <div v-if="dropdownOpen === affiliate.id"
                    class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                    <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                      @click="handleAction(affiliate.id, 'aprovar')">
                      <i class="fas fa-check-circle mr-2"></i>
                      Aprovar
                    </button>
                    <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                      @click="handleAction(affiliate.id, 'bloquear')">
                      <i class="fas fa-ban mr-2"></i>
                      Bloquear
                    </button>
                  </div>
                </div>
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
    MenuIcon
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

    const dropdownOpen = ref<string | null>(null)

    const toggleDropdown = (id: string) => {
      dropdownOpen.value = dropdownOpen.value === id ? null : id
    }

    const handleAction = async (id: string, action: string) => {
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
        dropdownOpen.value = null;
      } catch (e) {
        console.error(`Erro ao executar ação ${action}:`, e);
      }
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
      dropdownOpen,
      toggleDropdown,
      handleAction,
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
      addEditApp
    }
  }
})
</script>

<style scoped>
/* Estilos específicos para Affiliates.vue */
</style>
