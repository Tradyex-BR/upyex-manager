<template>
  <BaseModal title="Novo Usuário" :show-footer="false" @close="$emit('update:modelValue', false)"
    :content-class="'gap-[64px]'">
    <div class="flex flex-col gap-6">
      <BaseInput v-model="formData.name" label="Nome" placeholder="Digite o nome completo do usuário"
        :disabled="loading" variant="dark">
        <template #prefix>
          <UserIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <BaseInput v-model="formData.email" label="Email" placeholder="Digite o email do usuário" :disabled="loading"
        variant="dark">
        <template #prefix>
          <EmailConfigIcon class="w-5 h-5 text-[#B8B8B8]" />
        </template>
      </BaseInput>

      <div class="flex gap-4 mt-4">
        <BaseButton variant="outline" class="flex-1" @click="$emit('update:modelValue', false)" :disabled="loading">
          Cancelar
        </BaseButton>
        <BaseButton class="flex-1" @click="handleSubmit" :disabled="!isFormValid || loading">
          {{ loading ? "Criando..." : "Criar Usuário" }}
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
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailConfigIcon from '@/components/icons/EmailConfigIcon.vue'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'
import { logger } from '@/config/logger'

export default defineComponent({
  name: 'CreateUserModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    UserIcon,
    EmailConfigIcon
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'submit'],
  setup(_, { emit }) {
    const loading = ref(false)
    const formData = ref({
      name: '',
      email: ''
    })

    const isFormValid = computed(() => {
      if (!formData.value.name.trim() || !formData.value.email.trim()) {
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(formData.value.email)
    })

    const handleSubmit = async () => {
      try {
        loading.value = true
        emit('submit', formData.value)
        emit('update:modelValue', false)
      } catch (error) {
        logger.error('Erro ao criar usuário:', error)
        notificationService.error('Erro ao criar usuário')
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