<template>
  <BaseModal title="Editar Usuário" :show-footer="false" @close="$emit('update:modelValue', false)" :content-class="'gap-[64px]'">
    <div class="flex flex-col gap-6">
      <BaseInput v-model="formData.name" label="Nome" placeholder="Digite o nome completo do usuário" :disabled="loading"
        variant="dark">
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

      <div class="flex items-center justify-between">
        <p class="text-white font-inter font-light leading-5">Status do Usuário</p>
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
        <BaseButton variant="outline" class="flex-1" @click="$emit('update:modelValue', false)" :disabled="loading">
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
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailConfigIcon from '@/components/icons/EmailConfigIcon.vue'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'
import { logger } from '@/config/logger'

export default defineComponent({
  name: 'EditUserModal',
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
    },
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const formData = ref({
      name: '',
      email: '',
      is_active: true
    })

    const isFormValid = computed(() => {
      if (!formData.value.name.trim() || !formData.value.email.trim()) {
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(formData.value.email)
    })

    const loadUserData = async () => {
      try {
        loading.value = true
        const user = await managerService.users.get(props.userId)
        formData.value = {
          name: user.name,
          email: user.email,
          is_active: user.is_active
        }
      } catch (error) {
        logger.error('Erro ao carregar dados do usuário:', error)
        notificationService.error('Erro ao carregar dados do usuário')
        emit('update:modelValue', false)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        emit('submit', formData.value)
        emit('update:modelValue', false)
      } catch (error) {
        logger.error('Erro ao atualizar usuário:', error)
        notificationService.error('Erro ao atualizar usuário')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadUserData()
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