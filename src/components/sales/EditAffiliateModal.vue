<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-[#23263a] rounded-lg p-8 w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4 text-white">Editar Afiliado</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-white mb-1">Nome</label>
          <input v-model="form.name" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">E-mail</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Código de Integração</label>
          <input v-model="form.integration_code" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white" required />
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Ativo?</label>
          <select v-model="form.is_active" class="w-full px-3 py-2 rounded bg-[#181a2a] text-white">
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-white mb-1">Aplicações</label>
          <div v-for="(app, idx) in form.applications" :key="app.id" class="mb-2 p-2 bg-[#1a1a2a] rounded">
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
          </div>
        </div>
        <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 bg-gray-500 rounded text-white" @click="$emit('close')"
            :disabled="loading">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-green-600 rounded text-white" :disabled="loading">
            <span v-if="loading">Salvando...</span>
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'EditAffiliateModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    affiliate: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      email: '',
      integration_code: '',
      is_active: true,
      applications: [] as any[]
    })
    const loading = ref(false)
    const error = ref('')

    watch(() => props.affiliate, (newAffiliate) => {
      if (newAffiliate) {
        form.value = { ...newAffiliate }
      }
    }, { immediate: true })

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      try {
        emit('save', form.value)
      } catch (e: any) {
        error.value = e.message || 'Erro ao salvar afiliado'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleSubmit
    }
  }
})
</script> 