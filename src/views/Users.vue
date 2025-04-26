<template>
  <div class=" overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Usuários</p>
              <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                Novo Usuário
              </button>
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
                          @click="toggleDropdown(usuario.id)"
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                        >
                          Ações
                        </button>
                        <div 
                          v-if="dropdownOpen === usuario.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            @click="handleAction(usuario.id, 'bloquear')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-yellow-500"
                          >
                            Bloquear
                          </button>
                          <button 
                            @click="handleAction(usuario.id, 'editar-permissao')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-blue-500"
                          >
                            Editar Permissão
                          </button>
                          <button 
                            @click="handleAction(usuario.id, 'resetar-senha')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-purple-500"
                          >
                            Resetar Senha
                          </button>
                          <button 
                            @click="handleAction(usuario.id, 'excluir')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
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

interface Usuario {
  id: number;
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
    TopBar
  },
  data() {
    return {
      usuarios: [] as Usuario[],
      dropdownOpen: null as number | null
    }
  },
  methods: {
    getStatusClass(status: string): string {
      const classes = {
        'Ativo': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Bloqueado': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    handleAction(id: number, action: string) {
      // Aqui você pode implementar a lógica para cada ação
      console.log(`Ação ${action} para o usuário ${id}`)
      this.dropdownOpen = null
    },
    carregarUsuarios() {
      this.usuarios = [
        {
          id: 1,
          nome: 'João Silva',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 2,
          nome: 'Maria Souza',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 3,
          nome: 'Carlos Lima',
          email: 'email@email.com',
          status: 'Bloqueado',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 4,
          nome: 'Aline de Souza',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 5,
          nome: 'Megan Marinho',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 6,
          nome: 'Elizabeth Pinheiro',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        },
        {
          id: 7,
          nome: 'Gabriela de Lima',
          email: 'email@email.com',
          status: 'Ativo',
          dataCadastro: '12/03/2025',
          ultimoAcesso: '12/03/2025 14:21'
        }
      ]
    }
  },
  mounted() {
    this.carregarUsuarios()
    // Fechar o dropdown quando clicar fora
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        this.dropdownOpen = null
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', () => {})
  }
})
</script> 