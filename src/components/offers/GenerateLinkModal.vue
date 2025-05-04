<template>
  <BaseModal
    :title="role === 'manager' ? 'Nova Aplicação' : 'Gerar Link Genérico'"
    @close="$emit('close')"
  >
    <template #default>
      <div class="flex flex-col gap-6">
        <form v-if="role === 'manager'" @submit.prevent="handleSubmit" class="flex flex-col gap-6">
          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5" for="name">Nome</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <input id="name" v-model="form.name" type="text" required
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
                placeholder="Digite o nome da aplicação" />
            </div>
          </div>

          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5" for="description">Descrição</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <input id="description" v-model="form.description" type="text" required
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
                placeholder="Digite a descrição da aplicação" />
            </div>
          </div>

          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5" for="logo_url">URL do Logo</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <input id="logo_url" v-model="form.logo_url" type="url"
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
                placeholder="Digite a URL do logo" />
            </div>
          </div>

          <div class="flex flex-col gap-1 text-left">
            <label class="text-white text-sm font-medium leading-5" for="base_affiliate_link">Link Base de Afiliado</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <input id="base_affiliate_link" v-model="form.base_affiliate_link" type="url" required
                class="bg-transparent border-none text-white w-full outline-none text-sm p-2.5 placeholder:text-[#CACACA] placeholder:font-inter placeholder:text-base placeholder:font-normal placeholder:leading-5"
                placeholder="Digite o link base de afiliado" />
            </div>
          </div>
        </form>

        <!-- Conteúdo para afiliados -->
        <div v-else class="flex flex-col items-center gap-4">
          <div class="flex flex-col gap-1 text-left w-full">
            <label class="text-white text-sm font-medium leading-5">Seu link de afiliado</label>
            <div class="h-14 flex flex-row items-center bg-transparent px-3 py-4 rounded-lg border border-[#162F65]">
              <p v-if="loading" class="text-white font-medium flex-1">Gerando link...</p>
              <p v-else class="text-white font-medium break-all flex-1">{{ affiliateLink }}</p>
              <CopyButton v-if="!loading" :stringToCopy="affiliateLink" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <button v-if="role === 'manager'" type="button" @click="$emit('close')"
          class="px-6 py-2 bg-[#162F65] hover:bg-[#1A3A7A] rounded-lg text-white font-medium transition-colors">
          Cancelar
        </button>
        <button v-if="role === 'manager'" type="submit" @click="handleSubmit"
          class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
          Criar Aplicação
        </button>
        <button v-else @click="$emit('close')"
          class="px-6 py-2 bg-[#CF631C] hover:bg-[#E67E22] rounded-lg text-white font-medium transition-colors">
          Fechar
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import CopyButton from '@/components/common/CopyButton.vue'
import { managerService } from '@/services/managerService'
import { useToast } from 'vue-toastification'

const props = defineProps({
  role: {
    type: String,
    required: true
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