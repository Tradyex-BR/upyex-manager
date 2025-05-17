<template>
  <BaseModal title="Nova Aplicação" :show-footer="false" @close="$emit('close')" :content-class="'gap-[64px]'">
    <div class="flex flex-col gap-6">
      <BaseInput v-model="formData.name" label="Nome" placeholder="Digite o nome da plataforma" :disabled="loading"
        variant="dark">
        <template #prefix>
          <TagIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.description" label="Descrição" placeholder="Digite a descrição da plataforma"
        :disabled="loading" variant="dark">
        <template #prefix>
          <FileTextIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.logo_url" label="URL do Logo" placeholder="Digite a URL do logo (opcional)"
        :disabled="loading" variant="dark">
        <template #prefix>
          <ImageIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.base_affiliate_link" label="Link de Afiliado Base"
        placeholder="Digite o link de afiliado base" :disabled="loading" variant="dark">
        <template #prefix>
          <LinkIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <div class="flex gap-4 mt-4">
        <BaseButton variant="outline" class="flex-1" @click="$emit('close')" :disabled="loading">
          Cancelar
        </BaseButton>
        <BaseButton class="flex-1" @click="handleSubmit" :disabled="!isFormValid || loading">
          {{ loading ? "Criando..." : "Criar Aplicação" }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TagIcon from '@/components/icons/TagIcon.vue'
import FileTextIcon from '@/components/icons/FileTextIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'
import { logger } from '@/config/logger'

export default defineComponent({
  name: 'CreateApplicationModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    TagIcon,
    FileTextIcon,
    ImageIcon,
    LinkIcon
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const formData = ref({
      name: '',
      description: '',
      logo_url: '',
      base_affiliate_link: ''
    })

    const isFormValid = computed(() => {
      return formData.value.name &&
        formData.value.description &&
        formData.value.base_affiliate_link
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        const createdApplication = await managerService.applications.create(formData.value)
        notificationService.success('Aplicação criada com sucesso')
        emit('submit', createdApplication)
        emit('close')
      } catch (error) {
        logger.error('Erro ao criar aplicação:', error)
        notificationService.error('Erro ao criar aplicação')
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      isFormValid,
      handleSubmit
    }
  }
})
</script> 