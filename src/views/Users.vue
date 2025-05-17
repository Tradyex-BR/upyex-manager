<script lang="ts">
import { defineAsyncComponent, defineComponent, ref, watch } from 'vue'
import { managerService } from '@/services/managerService'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout.vue'
import { useRouter } from 'vue-router'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { logger } from '@/config/logger'
import BasePagination from '@/components/common/BasePagination.vue'
import { usePaginationStore } from '@/stores/pagination'
import { useDashboardStore } from '@/stores/dashboard'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import CreateUserModal from '@/components/users/CreateUserModal.vue'
import EditUserModal from '@/components/users/EditUserModal.vue'
import DeleteUserModal from '@/components/users/DeleteUserModal.vue'

const PenIcon = defineAsyncComponent(() => import('@/components/icons/PenIcon.vue'))
const TrashIcon = defineAsyncComponent(() => import('@/components/icons/TrashIcon.vue'))

interface Usuario {
  id: string;
  nome: string;
  email: string;
  aplicacao: string;
  afiliado: string;
  status: string;
  dataCadastro: string;
  ultimoAcesso: string;
  linkApi: string;
  phone?: string;
  document_number?: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links?: any;
}

export default defineComponent({
  name: 'Users',
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
    BaseModal,
    MenuIcon,
    BaseDropdown,
    BaseTable,
    BasePagination,
    CreateUserModal,
    EditUserModal,
    DeleteUserModal
  },
  setup() {
    const store = useDashboardStore()
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const loading = ref(true)
    const users = ref<any[]>([])
    const searchQuery = ref('')
    const paginationStore = usePaginationStore()
    const pagination = ref<PaginationMeta>({
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: paginationStore.perPage,
      to: 1,
      total: 0
    })

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
        const response = await managerService.users.list({
          search: term,
          page: page,
          per_page: paginationStore.perPage,
          sort_by: 'created_at',
          sort_order: 'desc'
        })
        users.value = (response.data || []).map((item: any) => ({
          id: item.id,
          nome: item.name || '',
          email: item.email || '',
          status: item.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-'
        }))
        if (response.meta) {
          pagination.value = response.meta
        }
      } catch (e) {
        logger.error('Erro ao buscar usuários:', e)
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = async (newPage: number) => {
      await handleSearch(searchQuery.value, newPage)
    }

    const navigateToEdit = (user: any) => {
      router.push(`/users/${user.id}/edit`)
    }

    const dropdownOptions = [
      {
        text: 'Editar',
        action: 'edit',
        icon: PenIcon
      },
      {
        text: 'Excluir',
        action: 'delete',
        icon: TrashIcon
      }
    ]

    return {
      store,
      router,
      authStore,
      toast,
      loading,
      users,
      searchQuery,
      pagination,
      handleSearch,
      handlePageChange,
      navigateToEdit,
      dropdownOptions
    }
  },
  data() {
    return {
      dropdownOpen: null as string | null,
      showDetailModal: false,
      showCreateModal: false,
      showDeleteModal: false,
      editingUser: null as Usuario | null,
      deletingUser: null as Usuario | null
    }
  },
  watch: {
    searchTerm(newTerm) {
      this.handleSearch(newTerm);
    }
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    getStatusClass(status: string): string {
      const baseClass = 'font-inter text-[14px] font-medium leading-[18px] inline-flex h-6 px-2 justify-center items-center gap-1 rounded-[6px] w-fit mx-auto'
      const statusMap: { [key: string]: string } = {
        'Ativo': `${baseClass} bg-green-500/20 text-green-500`,
        'Bloqueado': `${baseClass} bg-red-500/20 text-red-500`,
        'Inativo': `${baseClass} bg-red-500/20 text-red-500`
      }
      return statusMap[status] || `${baseClass} bg-gray-500/20 text-gray-500`
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    async handleUserAction(id: string, action: string) {
      try {
        const user = this.users.find(u => u.id === id);
        if (!user) return;

        switch (action) {
          case 'edit':
            this.editingUser = user;
            this.showDetailModal = true;
            break;
          case 'delete':
            this.deletingUser = user;
            this.showDeleteModal = true;
            break;
        }
      } catch (e) {
        logger.error(`Erro ao executar ação ${action}:`, e)
      }
    },
    async handleDeleteUser() {
      if (!this.deletingUser) return;

      try {
        await managerService.users.delete(this.deletingUser.id);
        this.toast.success('Usuário excluído com sucesso!');
        this.showDeleteModal = false;
        this.deletingUser = null;
        await this.loadUsers();
      } catch (e) {
        logger.error('Erro ao excluir usuário:', e);
        this.toast.error('Erro ao excluir usuário');
      }
    },
    async handleUpdateUser(userData: any) {
      if (!this.editingUser) return;
      
      try {
        this.loading = true;
        await managerService.users.update(this.editingUser.id, userData);
        this.toast.success('Usuário atualizado com sucesso!');
        this.showDetailModal = false;
        this.editingUser = null;
        await this.loadUsers();
      } catch (e) {
        logger.error('Erro ao atualizar usuário:', e);
        this.toast.error('Erro ao atualizar usuário');
      } finally {
        this.loading = false;
      }
    },
    async handleCreateUser(userData: any) {
      try {
        await managerService.users.create(userData);
        this.toast.success('Usuário criado com sucesso!');
        this.showCreateModal = false;
        await this.loadUsers();
      } catch (e) {
        logger.error('Erro ao criar usuário:', e);
        this.toast.error('Erro ao criar usuário');
      }
    },
    goToUserDetail(id: string) {
      const user = this.users.find(u => u.id === id)
      if (user) {
        this.editingUser = user
        this.showDetailModal = true
      }
    },
    async loadUsers() {
      this.loading = true;
      try {
        const response = await managerService.users.list({
          search: null,
          page: 1,
          per_page: 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        this.users = (response.data || []).map((item: any) => ({
          id: item.id,
          nome: item.name || '',
          email: item.email || '',
          status: item.is_active ? 'Ativo' : 'Inativo',
          dataCadastro: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '-',
          ultimoAcesso: item.updated_at ? new Date(item.updated_at).toLocaleDateString('pt-BR') : '-'
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
      } catch (e) {
        logger.error('Erro ao carregar usuários:', e);
      } finally {
        this.loading = false;
      }
    }
  }
})
</script>

<template>
  <AuthenticatedLayout :loading="loading">
    <section class="w-full overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <p class="text-white text-2xl font-semibold">Usuários</p>
        <BaseButton @click="showCreateModal = true" class="bg-primary-500 hover:bg-primary-600">
          Novo Usuário
        </BaseButton>
      </div>
      <div class="flex w-full justify-center text-gray-400">
        <div v-if="loading" class="flex items-center justify-center py-10">
          <span class="text-white text-lg">Carregando usuários...</span>
        </div>
        <div v-else-if="users.length === 0"
          class="flex w-full min-h-[642.50px] items-center justify-center text-gray-400 text-lg">
          Nenhum usuário encontrado
        </div>
        <div v-else class="overflow-visible w-full">
          <BaseTable :headers="[
            { key: 'name', label: 'Nome', align: 'left' },
            { key: 'email', label: 'Email', align: 'center' },
            { key: 'status', label: 'Status', align: 'center' },
            { key: 'created_at', label: 'Data de cadastro', align: 'center' },
            { key: 'last_access', label: 'Último acesso', align: 'center' },
            { key: 'actions', label: 'Ações', align: 'center' }
          ]" :items="users">
            <template #name="{ item }">
              {{ item.nome || "-" }}
            </template>

            <template #email="{ item }">
              {{ item.email }}
            </template>

            <template #status="{ item }">
              <span :class="getStatusClass(item.status)">{{ item.status }}</span>
            </template>

            <template #created_at="{ item }">
              {{ item.dataCadastro }}
            </template>

            <template #last_access="{ item }">
              {{ item.ultimoAcesso }}
            </template>

            <template #actions="{ item }">
              <BaseDropdown :options="dropdownOptions" @select="handleUserAction(item.id, $event)" :top="50"
                class="w-min mx-auto" />
            </template>
          </BaseTable>
        </div>
      </div>
    </section>
    <BasePagination :meta="pagination" @page-change="handlePageChange" />

    <!-- Modal de Criação -->
    <CreateUserModal v-if="showCreateModal" v-model="showCreateModal" @submit="handleCreateUser" />

    <!-- Modal de Edição -->
    <EditUserModal v-if="showDetailModal && editingUser?.id" v-model="showDetailModal" :user-id="editingUser.id"
      @submit="handleUpdateUser" />

    <!-- Modal de Confirmação de Exclusão -->
    <DeleteUserModal v-if="showDeleteModal && deletingUser?.id && deletingUser?.nome" v-model="showDeleteModal"
      :user-id="deletingUser.id" :user-name="deletingUser.nome" @submit="handleDeleteUser" />
  </AuthenticatedLayout>
</template>
