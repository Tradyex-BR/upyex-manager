<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    Carregando...
  </div>
  <div v-else-if="usuarios.length === 0" class="flex w-full h-full items-center justify-center text-gray-400">
    Nenhum usuário encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Usuários</p>
              <BaseButton class="ml-2" @click="">
                Novo Usuário
              </BaseButton>
            </div>
            <div>
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Nome</th>
                    <th class="p-4 text-left">Email</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Data de cadastro</th>
                    <th class="p-4 text-left">Último acesso</th>
                    <th class="p-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="usuario in usuarios" :key="usuario.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ usuario.nome }}</td>
                    <td class="p-4">{{ usuario.email }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(usuario.status)">{{ usuario.status }}</span>
                    </td>
                    <td class="p-4">{{ usuario.dataCadastro }}</td>
                    <td class="p-4">{{ usuario.ultimoAcesso }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button 
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                          @click="toggleDropdown(usuario.id)"
                        >
                          Ações
                        </button>
                        <div 
                          v-if="dropdownOpen === usuario.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-yellow-500"
                            @click="handleAction(usuario.id, 'bloquear')"
                          >
                            Bloquear
                          </button>
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-blue-500"
                            @click="handleAction(usuario.id, 'editar-permissao')"
                          >
                            Editar Permissão
                          </button>
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-purple-500"
                            @click="handleAction(usuario.id, 'resetar-senha')"
                          >
                            Resetar Senha
                          </button>
                          <button 
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                            @click="handleAction(usuario.id, 'excluir')"
                          >
                            Excluir
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { managerService } from '@/services/managerService';


interface Usuario {
  id: string;
  nome: string;
  email: string;
  status: string;
  dataCadastro: string;
  ultimoAcesso: string;
}

export default defineComponent({
  name: 'Usuarios',
  components: {
    Sidebar,
    TopBar,
    BaseButton
  },
  data() {
    return {
      usuarios: [] as Usuario[],
      dropdownOpen: null as string | null,
      loading: true
    }
  },
  async mounted() {
    this.loading = true
    try {
      // Ajuste os parâmetros conforme necessário para o endpoint correto de usuários
      const response = await managerService.customers.list({
        search: null,
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      // Mapeia o retorno do backend para o formato esperado pela tabela
      this.usuarios = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        nome: item.name || '',
        email: item.email || '',
        status: item.status || '',
        dataCadastro: item.dataCadastro || item.created_at || '',
        ultimoAcesso: item.ultimoAcesso || item.last_access || ''
      }));
      // offersSuccess removido, não é mais necessário
    } catch (e) {
      // Não faz nada, continua carregando
    } finally {
      this.loading = false
    }
  },

  beforeUnmount() {
    document.removeEventListener('click', () => {})
  },
  methods: {
    getStatusClass(status: string): string {
      const classes = {
        'Ativo': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Bloqueado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: string) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    handleAction(id: string, action: string) {
      // Aqui você pode implementar a lógica para cada ação
      console.log(`Ação ${action} para o usuário ${id}`)
      this.dropdownOpen = null
    },
  }
})
</script> 