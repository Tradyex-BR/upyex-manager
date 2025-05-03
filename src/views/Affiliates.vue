<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhum afiliado encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Afiliados</p>
              <BaseButton @click="openCreateModal" class="bg-[#CF631C] cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Novo Afiliado
              </BaseButton>
            </div>
            <div>
              <div v-if="loading" class="flex items-center justify-center py-10">
                <span class="text-white text-lg">Carregando afiliados...</span>
              </div>
              <table v-else class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Nome</th>
                    <!-- <th class="p-4 text-left">E-mail</th> -->
                    <th class="p-4 text-left">Código de Integração</th>
                    <th class="p-4 text-left">Data de Cadastro</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="affiliate in affiliates" :key="affiliate.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4 flex items-center gap-2">
                      <img :src="`https://ui-avatars.com/api/?name=${affiliate.name}&background=random`"
                        :alt="affiliate.name" class="w-10 h-10 rounded-full" />
                      <p class="text-white text-sm font-semibold">{{ affiliate.name }}</p>
                    </td>
                    <!--   <td class="p-4">{{ affiliate.email }}</td> -->
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
                        <button class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(affiliate.id)">
                          Ações
                        </button>
                        <div v-if="dropdownOpen === affiliate.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-green-500"
                            @click="navigateToEdit(affiliate)">
                            Editar
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

  <!-- Modal de criação de afiliado -->
  <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-8 border-b border-[#2A2F4C] pb-4">
        <div class="flex items-center gap-3">
          <i class="fas fa-user-plus text-[#CF631C] text-2xl"></i>
          <h2 class="text-2xl font-bold text-white">Criar Afiliado</h2>
        </div>
        <button @click="showCreateModal = false" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleCreate" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.name" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
            <div>
              <label class="block text-white mb-2 font-medium">E-mail</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.email" type="email" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-2 font-medium">Código de Integração</label>
              <div class="relative">
                <i class="fas fa-code absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.integration_code" class="w-full pl-10 pr-3 py-2 rounded bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <i class="fas fa-mobile-alt text-[#CF631C]"></i>
            <label class="block text-white font-medium">Aplicações</label>
          </div>
          <div v-for="(app, idx) in createForm.applications" :key="idx" class="mb-4 p-4 bg-[#23263a] rounded-lg border border-[#2A2F4C]">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-400 mb-1">ID da Aplicação</label>
                <div class="relative">
                  <i class="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model="app.id" class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">% Comissão</label>
                <div class="relative">
                  <i class="fas fa-percent absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Dias para Liberação</label>
                <div class="relative">
                  <i class="fas fa-calendar-day absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_release_days" type="number" min="0"
                    class="w-full pl-10 pr-3 py-2 rounded bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" required />
                </div>
              </div>
            </div>
            <button type="button" class="text-red-400 mt-3 text-sm hover:text-red-300 transition-colors flex items-center gap-1" @click="removeApp(idx)">
              <i class="fas fa-trash-alt"></i>
              Remover
            </button>
          </div>
          <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition-colors flex items-center gap-2" @click="addApp">
            <i class="fas fa-plus"></i>
            Adicionar Aplicação
          </button>
        </div>

        <div v-if="createError" class="mt-4 p-3 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i>
          {{ createError }}
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2A2F4C]">
          <button type="button" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2" @click="showCreateModal = false">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" class="px-6 py-2 bg-[#CF631C] text-white rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" :disabled="createLoading">
            <i class="fas fa-save"></i>
            <span v-if="createLoading">Salvando...</span>
            <span v-else>Criar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

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
    TopBar
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

    const handleCreate = async () => {
      createLoading.value = true
      createError.value = ''
      try {
        const payload = {
          name: createForm.value.name,
          email: createForm.value.email,
          integration_code: createForm.value.integration_code,
          applications: createForm.value.applications.map(app => ({
            id: app.id,
            commission_percentage: app.commission_percentage,
            commission_release_days: app.commission_release_days
          }))
        }
        await managerService.affiliates.create(payload)
        await handleSearch('')
        closeCreateModal()
      } catch (e) {
        createError.value = 'Erro ao criar afiliado.'
      } finally {
        createLoading.value = false
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
      switch (action) {
        case 'editar': {
          const affiliate = affiliates.value.find(a => a.id === id)
          if (affiliate) {
            selectedAffiliate.value = affiliate
            editForm.value = {
              name: affiliate.name,
              email: affiliate.email,
              integration_code: affiliate.integration_code,
              is_active: affiliate.is_active,
              applications: affiliate.applications ? affiliate.applications.map(app => ({ ...app })) : []
            }
            openDetailsModal(affiliate)
          }
          break
        }
        case 'bloquear':
          await handleToggleStatus(id, false)
          break
        case 'excluir':
          await store.deleteAffiliate(id)
          break
      }
      dropdownOpen.value = null
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
