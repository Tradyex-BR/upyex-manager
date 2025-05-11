<template>
  <BaseModal :title="role === 'manager' ? 'Nova Aplicação' : 'Gerar Link Genérico'" @close="$emit('close')">
    <template #default>
      <div class="flex flex-col gap-6">
        <form v-if="role === 'manager'" @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <BaseInput
            v-model="form.name"
            label="Nome"
            placeholder="Digite o nome da aplicação"
            required
          />

          <BaseInput
            v-model="form.description"
            label="Descrição"
            placeholder="Digite a descrição da aplicação"
            required
          />

          <BaseInput
            v-model="form.logo_url"
            label="URL do Logo"
            type="url"
            placeholder="Digite a URL do logo"
          />

          <BaseInput
            v-model="form.base_affiliate_link"
            label="Link Base de Afiliado"
            type="url"
            placeholder="Digite o link base de afiliado"
            required
          />
        </form>

        <!-- Conteúdo para afiliados -->
        <div v-else class="flex flex-col items-center gap-5">
          <div class="flex flex-col gap-2 text-left w-full">
            <label class="text-white text-sm font-medium leading-5">Seu link de afiliado</label>
            <div
              class="h-14 flex flex-row items-center bg-[#131836] px-4 py-4 rounded-lg border border-[#1e2642] focus-within:border-[#3b4167] transition-colors">
              <p v-if="loading" class="text-white font-medium flex-1">Gerando link...</p>
              <p v-else class="text-white font-medium break-all flex-1">{{ affiliateLink }}</p>
              <CopyButton v-if="!loading" :stringToCopy="affiliateLink" class="ml-2" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-5 mt-4">
        <button v-if="role === 'manager'" type="button" @click="$emit('close')"
          class="px-5 py-3 h-12 bg-[#131836] border border-[#1e2642] hover:bg-[#1e2642] rounded-lg text-white font-medium transition-colors">
          Cancelar
        </button>
        <button v-if="role === 'manager'" type="submit" @click="handleSubmit"
          class="px-5 py-3 h-12 bg-[#e67e22] hover:bg-[#d35400] rounded-lg text-white font-medium transition-colors">
          Criar Aplicação
        </button>
        <BaseButton v-else @click="$emit('close')" variant="outline" class="px-5 py-3 h-12">Fechar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { managerService } from '@/services/managerService'
import { useToast } from 'vue-toastification'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps({
  role: {
    type: String,
    required: false
  },
  applicationId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])
const toast = useToast()
const loading = ref(false)
const affiliateLink = ref('')

const form = ref({
  name: '',
  description: '',
  logo_url: '',
  base_affiliate_link: ''
})

const handleSubmit = () => {
  emit('submit', form.value)
}

const generateAffiliateLink = async () => {
  if (props.role === 'manager') return

  loading.value = true
  try {
    const response = await managerService.applications.generateAffiliateLink(props.applicationId)
    affiliateLink.value = response.affiliate_link
  } catch (error) {
    console.error('Erro ao gerar link de afiliado:', error)
    toast.error('Erro ao gerar link de afiliado')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.role !== 'manager') {
    generateAffiliateLink()
  }
})
</script>