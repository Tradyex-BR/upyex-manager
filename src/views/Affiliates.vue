<template>
  <AuthenticatedLayout :loading="loading">
    <div class="overflow-hidden">
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
                <div v-if="affiliates.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
                  Nenhum afiliado encontrado.
                </div>
                <table v-else class="w-full text-white border-collapse">
                  <thead>
                    <tr class="bg-[#1A1F3C]">
                      <th class="p-4 text-left">Nome</th>
                      <th class="p-4 text-left">ID de Afiliado</th>
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
                      <td class="p-4">
                        <span class="text-sm text-gray-400">{{ affiliate.id }}</span>
                      </td>
                      <td class="p-4">{{ new Date(affiliate.created_at).toLocaleDateString('pt-BR') }}</td>
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
          </div>
        </main>
      </div>
    </div>

    <!-- Modal de criação de afiliado -->
    <BaseModal
      v-if="showCreateModal"
      title="Criar Afiliado"
      @close="closeCreateModal"
    >
      <template #icon>
        <div class="w-12 h-12 rounded-full bg-[#CF631C]/20 flex items-center justify-center">
          <i class="fas fa-user-plus text-[#CF631C] text-2xl"></i>
        </div>
      </template>

      <form @submit.prevent="handleCreate" class="space-y-8">
        <!-- Informações Básicas -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <h3 class="text-white text-lg font-semibold mb-6 flex items-center gap-2">
            <i class="fas fa-user text-[#CF631C]"></i>
            Informações Básicas
          </h3>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-400 mb-2 font-medium">Nome</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.name" 
                  class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                  placeholder="Nome completo do afiliado"
                  required />
              </div>
            </div>
            <div>
              <label class="block text-gray-400 mb-2 font-medium">E-mail</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.email" 
                  type="email" 
                  class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                  placeholder="email@exemplo.com"
                  required />
              </div>
            </div>
            <div class="col-span-2">
              <label class="block text-gray-400 mb-2 font-medium">Código de Integração</label>
              <div class="relative">
                <i class="fas fa-code absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input v-model="createForm.integration_code" 
                  class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#23263a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                  placeholder="Código único de integração"
                  required />
              </div>
            </div>
          </div>
        </div>

        <!-- Aplicações -->
        <div class="bg-[#1a1a2a] rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-white text-lg font-semibold flex items-center gap-2">
              <i class="fas fa-mobile-alt text-[#CF631C]"></i>
              Aplicações
            </h3>
            <button type="button" 
              class="bg-[#CF631C] text-white px-4 py-2 rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" 
              @click="addApp">
              <i class="fas fa-plus"></i>
              Adicionar Aplicação
            </button>
          </div>

          <div v-for="(app, idx) in createForm.applications" :key="idx" 
            class="mb-4 p-6 bg-[#23263a] rounded-lg border border-[#2A2F4C] hover:border-[#CF631C] transition-colors">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-white font-medium">Aplicação #{{ idx + 1 }}</h4>
              <button type="button" 
                class="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1" 
                @click="removeApp(idx)">
                <i class="fas fa-trash-alt"></i>
                Remover
              </button>
            </div>
            <div class="grid grid-cols-3 gap-6">
              <div>
                <label class="block text-gray-400 text-sm mb-2">ID da Aplicação</label>
                <div class="relative">
                  <i class="fas fa-hashtag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model="app.id" 
                    class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                    placeholder="ID único da aplicação"
                    required />
                </div>
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-2">% Comissão</label>
                <div class="relative">
                  <i class="fas fa-percent absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_percentage" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="1"
                    class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                    placeholder="0.00"
                    required />
                </div>
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-2">Dias para Liberação</label>
                <div class="relative">
                  <i class="fas fa-calendar-day absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input v-model.number="app.commission_release_days" 
                    type="number" 
                    min="0"
                    class="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#1a1a2a] text-white border border-[#2A2F4C] focus:border-[#CF631C] focus:outline-none transition-colors" 
                    placeholder="0"
                    required />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="createError" class="p-4 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i>
          {{ createError }}
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-4">
          <button type="button" 
            class="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2" 
            @click="closeCreateModal">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
          <button type="submit" 
            class="px-6 py-2.5 bg-[#CF631C] text-white rounded-lg hover:bg-[#B5520A] transition-colors flex items-center gap-2" 
            :disabled="createLoading"
            @click="handleCreate">
            <i class="fas fa-save"></i>
            <span v-if="createLoading">Salvando...</span>
            <span v-else>Criar Afiliado</span>
          </button>
        </div>
      </template>
    </BaseModal>
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
    BaseModal
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
