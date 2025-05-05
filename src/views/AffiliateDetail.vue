<template>
  <div v-if="loading" class="flex w-full h-full items-center justify-center text-gray-400">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  <div v-else-if="!affiliate" class="flex w-full h-full items-center justify-center text-gray-400">
    Afiliado não encontrado.
  </div>
  <div v-else class="overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class="min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-4">
                <button @click="$router.back()" class="text-white hover:text-gray-300">
                  <i class="fas fa-arrow-left"></i>
                </button>
                <p class="text-white text-2xl font-semibold">Detalhes do Afiliado</p>
              </div>
              <BaseButton
                variant="primary"
                @click="handleEdit">
                Editar
              </BaseButton>
            </div>

            <div class="bg-[#23263a] rounded-lg p-6 mb-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <h3 class="text-white text-lg font-semibold mb-4">Informações Básicas</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="text-gray-400 text-sm">Nome</label>
                      <p class="text-white">{{ affiliate.name }}</p>
                    </div>
                    <div>
                      <label class="text-gray-400 text-sm">Email</label>
                      <p class="text-white">{{ affiliate.email }}</p>
                    </div>
                    <div>
                      <label class="text-gray-400 text-sm">Código de Integração</label>
                      <p class="text-white">{{ affiliate.integration_code }}</p>
                    </div>
                    <div>
                      <label class="text-gray-400 text-sm">Status</label>
                      <span :class="affiliate.is_active ? 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500' : 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'">
                        {{ affiliate.is_active ? 'Ativo' : 'Inativo' }}
                      </span>
                    </div>
                    <div>
                      <label class="text-gray-400 text-sm">Data de Cadastro</label>
                      <p class="text-white">{{ new Date(affiliate.created_at).toLocaleDateString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-[#23263a] rounded-lg p-6">
              <h3 class="text-white text-lg font-semibold mb-4">Aplicações</h3>
              <BaseTable 
                :headers="[
                  { key: 'id', label: 'ID da Aplicação', align: 'left' },
                  { key: 'commission', label: '% Comissão', align: 'left' },
                  { key: 'release_days', label: 'Dias para Liberação', align: 'left' }
                ]"
                :items="affiliate.applications"
              >
                <template #id="{ item }">
                  {{ item.id }}
                </template>
                
                <template #commission="{ item }">
                  {{ (item.commission_percentage * 100).toFixed(2) }}%
                </template>
                
                <template #release_days="{ item }">
                  {{ item.commission_release_days }} dias
                </template>
              </BaseTable>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal de edição de afiliado -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4 text-white">Editar Afiliado</h2>
      <form @submit.prevent="saveAffiliateEdits">
        <div class="mb-4">
          <label class="block text-white mb-1">Nome</label>
          <input v-model="editForm.name" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">E-mail</label>
          <input v-model="editForm.email" type="email" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Código de Integração</label>
          <input v-model="editForm.integration_code" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Ativo?</label>
          <select v-model="editForm.is_active" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white">
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Aplicações</label>
          <div v-for="(app, idx) in editForm.applications" :key="app.id" class="mb-2 p-2 bg-[#1a1a2a] rounded">
            <div class="mb-1">
              <label class="block text-xs text-gray-400">ID</label>
              <input v-model="app.id" class="w-full px-2 py-1 rounded bg-[#23263a] text-white" readonly />
            </div>
            <div class="mb-1">
              <label class="block text-xs text-gray-400">% Comissão</label>
              <input v-model.number="app.commission_percentage" type="number" step="0.01" min="0" max="1"
                class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
            <div>
              <label class="block text-xs text-gray-400">Dias Liberação</label>
              <input v-model.number="app.commission_release_days" type="number" min="0"
                class="w-full px-2 py-1 rounded bg-[#23263a] text-white" />
            </div>
            <button type="button" class="text-red-400 mt-1 text-xs underline" @click="removeEditApp(idx)">Remover</button>
          </div>
          <button type="button" class="bg-blue-600 text-white px-2 py-1 rounded mt-2" @click="addEditApp">Adicionar
            Aplicação</button>
        </div>
        <div v-if="editError" class="text-red-500 mb-2">{{ editError }}</div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 bg-gray-500 rounded text-white" @click="showEditModal = false"
            :disabled="editLoading">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-green-600 rounded text-white" :disabled="editLoading">
            <span v-if="editLoading">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { managerService } from '@/services/managerService'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable from '@/components/common/BaseTable.vue'

export default defineComponent({
  name: 'AffiliateDetail',
  components: {
    BaseButton,
    BaseTable
  },
  data() {
    return {
      affiliate: null as any,
      loading: true,
      showEditModal: false,
      editForm: {
        name: '',
        email: '',
        integration_code: '',
        is_active: true,
        applications: []
      },
      editLoading: false,
      editError: ''
    }
  },
  async mounted() {
    const affiliateId = this.$route.params.id
    await this.loadAffiliate(affiliateId)
  },
  methods: {
    async loadAffiliate(id: string) {
      this.loading = true
      try {
        const response = await managerService.affiliates.get(id)
        this.affiliate = response
      } catch (e) {
        console.error('Erro ao carregar afiliado:', e)
      } finally {
        this.loading = false
      }
    },
    handleEdit() {
      this.editForm = {
        name: this.affiliate.name,
        email: this.affiliate.email,
        integration_code: this.affiliate.integration_code,
        is_active: this.affiliate.is_active,
        applications: this.affiliate.applications ? this.affiliate.applications.map(app => ({ ...app })) : []
      }
      this.showEditModal = true
    },
    async saveAffiliateEdits() {
      this.editLoading = true
      this.editError = ''
      try {
        await managerService.affiliates.update(this.affiliate.id, this.editForm)
        await this.loadAffiliate(this.affiliate.id)
        this.showEditModal = false
      } catch (e) {
        this.editError = 'Erro ao atualizar afiliado.'
      } finally {
        this.editLoading = false
      }
    },
    removeEditApp(idx: number) {
      this.editForm.applications.splice(idx, 1)
    },
    addEditApp() {
      this.editForm.applications.push({ id: '', commission_percentage: 0.2, commission_release_days: 7 })
    }
  }
})
</script> 