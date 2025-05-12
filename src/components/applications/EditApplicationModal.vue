<template>
  <BaseModal title="Editar Plataforma" :show-footer="false" @close="$emit('close')" :content-class="'gap-[64px]'">
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

      <div class="flex items-center justify-between">
        <p class="text-white font-inter font-light leading-5">Status da Plataforma</p>
        <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
          <input type="checkbox" v-model="formData.is_active" class="absolute w-0 h-0 opacity-0" id="toggle" />
          <label for="toggle" class="block h-6 overflow-hidden rounded-full cursor-pointer"
            :class="formData.is_active ? 'bg-green-500' : 'bg-gray-700'">
            <span
              class="absolute top-0 left-0 w-6 h-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out"
              :class="formData.is_active ? 'translate-x-6' : 'translate-x-0'"></span>
          </label>
        </div>
      </div>

      <div class="flex gap-4 mt-4">
        <BaseButton variant="outline" class="flex-1" @click="$emit('close')" :disabled="loading">
          Cancelar
        </BaseButton>
        <BaseButton class="flex-1" @click="handleSubmit" :disabled="!isFormValid || loading">
          {{ loading ? "Salvando..." : "Salvar Alterações" }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TagIcon from '@/components/icons/TagIcon.vue'
import FileTextIcon from '@/components/icons/FileTextIcon.vue'
import ImageIcon from '@/components/icons/ImageIcon.vue'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'

export default defineComponent({
  name: 'EditApplicationModal',
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
    },
    applicationId: {
      type: String,
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
      base_affiliate_link: '',
      is_active: true as boolean
    })

    const isFormValid = computed(() => {
      return formData.value.name &&
        formData.value.description &&
        formData.value.base_affiliate_link
    })

    const loadApplicationData = async () => {
      try {
        loading.value = true
        const application = await managerService.applications.get(props.applicationId)
        formData.value = {
          name: application.name,
          description: application.description,
          logo_url: application.logo_url || '',
          base_affiliate_link: application.base_affiliate_link,
          is_active: application.is_active ?? true
        }
      } catch (error) {
        console.error('Erro ao carregar dados da aplicação:', error)
        notificationService.error('Erro ao carregar dados da aplicação')
        emit('close')
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        await managerService.applications.update(props.applicationId, formData.value)
        notificationService.success('Aplicação atualizada com sucesso')
        emit('submit', formData.value)
        emit('close')
      } catch (error) {
        console.error('Erro ao atualizar aplicação:', error)
        notificationService.error('Erro ao atualizar aplicação')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadApplicationData()
    })

    return {
      formData,
      loading,
      isFormValid,
      handleSubmit
    }
  }
})
</script>