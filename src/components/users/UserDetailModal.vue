<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-[#181C2F] rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-white" @click="$emit('close')">
        &times;
      </button>
      <h2 class="text-xl font-bold mb-4 text-white">Detalhes do Usuário</h2>
      <div v-if="loading" class="text-gray-300">Carregando...</div>
      <div v-else-if="error" class="text-red-400">Erro ao carregar dados.</div>
      <div v-else-if="user">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white">
          <dt>Nome:</dt><dd>{{ user.name }}</dd>
          <dt>Email:</dt><dd>{{ user.email }}</dd>
          <dt>Telefone:</dt><dd>{{ user.phone || '-' }}</dd>
          <dt>Documento:</dt><dd>{{ user.document_number || '-' }}</dd>
          <dt>Data de Cadastro:</dt><dd>{{ formatDate(user.created_at) }}</dd>
          <dt>Última Atualização:</dt><dd>{{ formatDate(user.updated_at) }}</dd>
          <dt>Aplicação:</dt><dd>{{ user.application?.name || '-' }}</dd>
          <dt>Afiliado:</dt><dd>{{ user.affiliate?.name || '-' }}</dd>
          <dt>Status Afiliado:</dt><dd>{{ user.affiliate?.is_active === false ? 'Bloqueado' : 'Ativo' }}</dd>
          <dt>Email Afiliado:</dt><dd>{{ user.affiliate?.email || '-' }}</dd>
          <dt>Link API:</dt><dd><a :href="user.links?.api" target="_blank" class="text-blue-400 underline">{{ user.links?.api }}</a></dd>
          <dt>Link Frontend:</dt><dd><a :href="user.links?.frontend" target="_blank" class="text-blue-400 underline">{{ user.links?.frontend }}</a></dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'UserDetailModal',
  props: {
    visible: { type: Boolean, required: true },
    userApiUrl: { type: String, required: true }
  },
  data() {
    return {
      user: null as any,
      loading: false,
      error: false
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchUser();
      }
    },
    userApiUrl(newVal, oldVal) {
      if (this.visible && newVal !== oldVal) {
        this.fetchUser();
      }
    }
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      this.error = false;
      try {
        // Pega o token do localStorage (ajuste conforme o projeto)
        const token = localStorage.getItem('manager_token');
        const response = await axios.get(this.userApiUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        this.user = response.data;
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr: string) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleString('pt-BR');
    }
  }
});
</script>

<style scoped>
</style>
