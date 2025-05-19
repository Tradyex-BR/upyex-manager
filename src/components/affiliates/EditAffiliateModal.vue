<template>
  <BaseModal title="Editar Afiliado" :show-footer="false" @close="$emit('close')" :content-class="'gap-[64px]'">
    <div class="flex flex-col gap-6">
      <BaseInput v-model="formData.name" label="Nome" placeholder="Digite o nome completo do afiliado" :disabled="loading"
        variant="dark">
        <template #prefix>
          <UserIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.email" label="Email" placeholder="Digite o email do afiliado" :disabled="loading"
        variant="dark">
        <template #prefix>
          <EmailConfigIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.integration_code" label="Código de Afiliado" placeholder="Digite o código de afiliado"
        :disabled="loading" variant="dark">
        <template #prefix>
          <TagIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <div class="flex items-center justify-between">
        <p class="text-white font-inter font-light leading-5">Status do Afiliado</p>
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailConfigIcon from '@/components/icons/EmailConfigIcon.vue'
import TagIcon from '@/components/icons/TagIcon.vue'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'
import { logger } from '@/config/logger'

export default defineComponent({
  name: 'EditAffiliateModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    UserIcon,
    EmailConfigIcon,
    TagIcon
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    affiliateId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const formData = ref({
      name: '',
      email: '',
      integration_code: '',
      is_active: true,
      applications: [] as Array<{
        id: string;
        commission_percentage: number;
        commission_release_days: number;
      }>
    })

    const isFormValid = computed(() => {
      if (!formData.value.name.trim() || !formData.value.email.trim() || !formData.value.integration_code.trim()) {
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(formData.value.email)
    })

    const loadAffiliateData = async () => {
      if (!props.affiliateId) {
        logger.error('ID do afiliado não fornecido')
        notificationService.error('ID do afiliado não fornecido')
        emit('close')
        return
      }

      try {
        loading.value = true
        const affiliate = await managerService.affiliates.get(props.affiliateId)
        
        if (!affiliate) {
          throw new Error('Afiliado não encontrado')
        }

        formData.value = {
          name: affiliate.name,
          email: affiliate.email,
          integration_code: affiliate.integration_code,
          is_active: affiliate.is_active ?? true,
          applications: affiliate.applications || []
        }
      } catch (error) {
        logger.error('Erro ao carregar dados do afiliado:', error)
        notificationService.error('Erro ao carregar dados do afiliado')
        emit('close')
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      if (!props.affiliateId) {
        logger.error('ID do afiliado não fornecido')
        notificationService.error('ID do afiliado não fornecido')
        return
      }

      try {
        loading.value = true
        await managerService.affiliates.update(props.affiliateId, formData.value)
        notificationService.success('Afiliado atualizado com sucesso')
        emit('submit', formData.value)
        emit('close')
      } catch (error) {
        logger.error('Erro ao atualizar afiliado:', error)
        notificationService.error('Erro ao atualizar afiliado')
      } finally {
        loading.value = false
      }
    }

    watch(() => props.show, (newValue) => {
      if (newValue) {
        loadAffiliateData()
      }
    })

    onMounted(() => {
      if (props.show) {
        loadAffiliateData()
      }
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