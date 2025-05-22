<template>
  <BaseModal title="Editar Afiliado" :show-footer="false" @close="$emit('close')" :content-class="'gap-[64px]'">
    <div class="flex flex-col h-full max-h-[calc(100vh-100px)]">
      <!-- Tabs -->
      <div class="flex items-center justify-start gap-4 mb-4">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
          class="nav-btn w-full text-[14px] font-inter leading-[18px] relative px-4 py-2 rounded-lg transition-colors bg-transparent outline-none border-none"
          :class="{ 'active': activeTab === tab.value }">
          {{ tab.label }}
          <div v-if="activeTab === tab.value" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="33" viewBox="0 0 120 33" fill="none"
              preserveAspectRatio="none">
              <g filter="url(#filter0_f_73_1252)">
                <ellipse cx="59.8125" cy="32.5" rx="60.9375" ry="2.4375" fill="#397DFF" />
              </g>
              <path d="M-28.875 32.6875H148.875" stroke="url(#paint0_linear_73_1252)" stroke-width="0.75" />
              <defs>
                <filter id="filter0_f_73_1252" x="-31.125" y="0.0625" width="181.875" height="64.875"
                  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="15" result="effect1_foregroundBlur_73_1252" />
                </filter>
                <linearGradient id="paint0_linear_73_1252" x1="-28.875" y1="33.1875" x2="148.875" y2="33.1875"
                  gradientUnits="userSpaceOnUse">
                  <stop offset="0.0628151" stop-color="#111113" stop-opacity="0" />
                  <stop offset="0.555" stop-color="#397DFF" />
                  <stop offset="1" stop-color="#111113" stop-opacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </button>
      </div>

      <!-- Conteúdo com rolagem -->
      <div class="flex-1 overflow-y-auto">
        <!-- Informações Básicas -->
        <div v-if="activeTab === 'info'" class="space-y-4 h-[296px]">
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
        </div>

        <!-- Aplicações -->
        <div v-if="activeTab === 'apps'" :class="formData.applications.length > 1 ? 'mr-2' : ''"
          class="h-[296px] transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white text-sm font-medium">Aplicações</h3>
            <BaseButton variant="primary" class="bg-[#e67e22] hover:bg-[#d35400] text-white h-8 px-3 text-xs"
              @click="addApp">
              <template #icon>
                <FontAwesomeIcon icon="plus" />
              </template>
              Adicionar
            </BaseButton>
          </div>

          <div class="space-y-3">
            <div v-for="(app, idx) in formData.applications" :key="app.id || idx"
              class="bg-[#131836] rounded-lg border border-[#1e2642] overflow-hidden">
              <div class="flex items-center justify-between p-3">
                <div class="flex items-center">
                  <img :src="getSelectedAppLogo(app.id)" :alt="getSelectedAppName(app.id)"
                    class="w-5 h-5 rounded-full object-cover mr-2"
                    @error="(e) => handleImageError(e, getSelectedAppName(app.id))" />
                  <span class="text-sm font-medium">Aplicação #{{ idx + 1 }}</span>
                </div>
                <BaseButton variant="ghost" v-if="formData.applications.length > 1"
                  class="bg-[#2d1b1b] hover:bg-red-900 text-red-500 h-8 px-3 text-xs" @click="removeApp(idx)">
                  <FontAwesomeIcon icon="trash-alt" class="mr-1" />
                  Remover
                </BaseButton>
              </div>

              <div class="p-3 pt-0">
                <div class="space-y-4">
                  <div class="space-y-1">
                    <label class="text-white text-xs">Aplicação <span class="text-[#BE3E37]">*</span></label>
                    <BaseDropdown :options="getDropdownOptions(app.id)" :model-value="openDropdowns[idx]"
                      @update:model-value="(value) => openDropdowns[idx] = value"
                      @select="(action) => handleApplicationSelect(idx, action)" variant="full">
                      <template #trigger>
                        <button type="button"
                          class="w-full h-10 px-3 bg-[#1e2642] text-white rounded-lg border border-[#2d3a5a] text-left flex items-center gap-2 text-sm">
                          <img :src="getSelectedAppLogo(app.id)" :alt="getSelectedAppName(app.id)"
                            class="w-5 h-5 rounded-full object-cover"
                            @error="(e) => handleImageError(e, getSelectedAppName(app.id))" />
                          <span>{{ getSelectedAppName(app.id) }}</span>
                          <FontAwesomeIcon icon="chevron-down" class="ml-auto chevron-icon"
                            :class="{ 'open': openDropdowns[idx] }" />
                        </button>
                      </template>
                    </BaseDropdown>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <label class="text-white text-xs">Comissão (%)<span class="text-[#BE3E37]">*</span></label>
                      <BaseInput v-model.number="app.commission_percentage" type="number" step="0.01"
                        :min="rules ? rules.commission_percentage.min * 100 : 0"
                        :max="rules ? rules.commission_percentage.max * 100 : 100"
                        @blur="() => handleBlurValidation(app, 'commission_percentage')" placeholder="0.00" required
                        variant="darker" custom-class="h-10" :error="getCommissionError(app.commission_percentage)" />
                    </div>
                    <div class="space-y-1">
                      <label class="text-white text-xs">Dias para Liberação <span
                          class="text-[#BE3E37]">*</span></label>
                      <BaseInput v-model.number="app.commission_release_days" type="number"
                        :min="rules ? rules.commission_release_days.min : 0"
                        :max="rules ? rules.commission_release_days.max : 30"
                        @blur="() => handleBlurValidation(app, 'commission_release_days')" placeholder="0" required
                        variant="darker" custom-class="h-10"
                        :error="getReleaseDaysError(app.commission_release_days)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="error" class="p-3 bg-red-500/20 text-red-500 rounded-lg flex items-center gap-2 text-sm">
            <FontAwesomeIcon icon="exclamation-circle" class="mr-1" />
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="outline" class="bg-[#131836] hover:bg-[#1e2642] text-white border-[#2d3a5a] h-10"
          @click="$emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton variant="primary" type="submit" class="bg-[#e67e22] hover:bg-[#d35400] text-white h-10"
          :disabled="!isFormValid || loading" :loading="loading" @click="handleSubmit">
          {{ loading ? "Salvando..." : "Salvar Alterações" }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import EmailConfigIcon from '@/components/icons/EmailConfigIcon.vue'
import TagIcon from '@/components/icons/TagIcon.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrashAlt, faChevronDown, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { managerService } from '@/services/managerService'
import { notificationService } from '@/services/notificationService'
import { logger } from '@/config/logger'
import { getImageUrl, handleImageError } from '@/utils/imageUtils'

library.add(faPlus, faTrashAlt, faChevronDown, faExclamationCircle)

interface Application {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  base_affiliate_link: string;
  is_active?: boolean;
}

interface Rules {
  commission_percentage: {
    min: number;
    max: number;
  };
  commission_release_days: {
    min: number;
    max: number;
  };
}

export default defineComponent({
  name: 'EditAffiliateModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    BaseDropdown,
    UserIcon,
    EmailConfigIcon,
    TagIcon,
    FontAwesomeIcon
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    affiliateId: {
      type: String,
      required: true
    },
    rules: {
      type: Object as () => Rules | null,
      default: null
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const loading = ref(false)
    const error = ref('')
    const activeTab = ref('info')
    const availableApplications = ref<Application[]>([])
    const openDropdowns = ref<Record<number, boolean>>({})

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

    const tabs = [
      { label: 'Informações Básicas', value: 'info' },
      { label: 'Aplicações', value: 'apps' }
    ]

    const validateCommission = (value: number) => {
      if (!props.rules) return true;
      const commissionDecimal = value / 100;
      return commissionDecimal >= props.rules.commission_percentage.min &&
        commissionDecimal <= props.rules.commission_percentage.max;
    }

    const validateReleaseDays = (value: number) => {
      if (!props.rules) return true;
      return value >= props.rules.commission_release_days.min &&
        value <= props.rules.commission_release_days.max;
    }

    const getCommissionError = (value: number) => {
      if (!props.rules) return '';
      const commissionDecimal = value / 100;
      if (commissionDecimal < props.rules.commission_percentage.min) {
        return `A comissão mínima é ${props.rules.commission_percentage.min * 100}%`;
      }
      if (commissionDecimal > props.rules.commission_percentage.max) {
        return `A comissão máxima é ${props.rules.commission_percentage.max * 100}%`;
      }
      return '';
    }

    const getReleaseDaysError = (value: number) => {
      if (!props.rules) return '';
      if (value < props.rules.commission_release_days.min) {
        return `O mínimo de dias é ${props.rules.commission_release_days.min}`;
      }
      if (value > props.rules.commission_release_days.max) {
        return `O máximo de dias é ${props.rules.commission_release_days.max}`;
      }
      return '';
    }

    const getDropdownOptions = (currentAppId: string) => {
      return availableApplications.value
        .filter(app => {
          if (app.id === currentAppId) return true;
          return !formData.value.applications.some(selectedApp => selectedApp.id === app.id);
        })
        .map(app => ({
          text: app.name,
          action: app.id,
          icon: 'img',
          iconProps: {
            src: getImageUrl(app.name, app.logo_url),
            class: 'w-6 h-6 rounded-full object-cover',
            onError: (e: Event) => handleImageError(e, app.name)
          }
        }))
    }

    const handleApplicationSelect = (appIndex: number, appId: string) => {
      formData.value.applications[appIndex].id = appId
      openDropdowns.value[appIndex] = false
    }

    const getSelectedAppName = (appId: string) => {
      const app = availableApplications.value.find(a => a.id === appId)
      return app ? app.name : 'Selecione uma aplicação'
    }

    const getSelectedAppLogo = (appId: string): string => {
      const app = availableApplications.value.find(a => a.id === appId)
      return app ? getImageUrl(app.name, app.logo_url) : getImageUrl('Aplicação')
    }

    const isFormValid = computed(() => {
      if (!formData.value.name.trim() || !formData.value.email.trim() || !formData.value.integration_code.trim()) {
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.value.email)) {
        return false
      }

      const hasDuplicateApps = formData.value.applications.some((app, index) =>
        formData.value.applications.findIndex(a => a.id === app.id) !== index
      );

      if (hasDuplicateApps) {
        return false;
      }

      return formData.value.applications.every((app) => {
        if (!app.id.trim()) return false;

        if (!validateCommission(app.commission_percentage)) {
          return false;
        }

        if (!validateReleaseDays(app.commission_release_days)) {
          return false;
        }

        return true;
      })
    })

    const loadApplications = async () => {
      try {
        const response = await managerService.applications.list({
          search: null,
          page: 1,
          per_page: 100,
          sort_by: 'name',
          sort_order: 'asc'
        })
        availableApplications.value = response.data
      } catch (e) {
        logger.error('Erro ao carregar aplicações:', e)
        error.value = 'Erro ao carregar aplicações disponíveis'
      }
    }

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
          applications: affiliate.applications.map(app => ({
            ...app,
            commission_percentage: app.commission_percentage * 100
          })) || []
        }
      } catch (error) {
        logger.error('Erro ao carregar dados do afiliado:', error)
        notificationService.error('Erro ao carregar dados do afiliado')
        emit('close')
      } finally {
        loading.value = false
      }
    }

    const addApp = () => {
      formData.value.applications.push({ id: '', commission_percentage: 20, commission_release_days: 7 })
    }

    const removeApp = (idx: number) => {
      if (formData.value.applications.length > 1) {
        formData.value.applications.splice(idx, 1)
      }
    }

    const handleBlurValidation = (app: any, field: 'commission_percentage' | 'commission_release_days') => {
      if (!props.rules) return;

      if (field === 'commission_percentage') {
        const minComm = props.rules.commission_percentage.min * 100;
        const maxComm = props.rules.commission_percentage.max * 100;
        let value = parseFloat(String(app.commission_percentage));
        if (isNaN(value)) value = minComm;

        if (value < minComm) {
          app.commission_percentage = minComm;
        } else if (value > maxComm) {
          app.commission_percentage = maxComm;
        }
      } else if (field === 'commission_release_days') {
        const minDays = props.rules.commission_release_days.min;
        const maxDays = props.rules.commission_release_days.max;
        let value = parseInt(String(app.commission_release_days), 10);
        if (isNaN(value)) value = minDays;

        if (value < minDays) {
          app.commission_release_days = minDays;
        } else if (value > maxDays) {
          app.commission_release_days = maxDays;
        }
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
        const dataToSubmit = {
          ...formData.value,
          applications: formData.value.applications.map(app => ({
            ...app,
            commission_percentage: app.commission_percentage / 100
          }))
        }
        await managerService.affiliates.update(props.affiliateId, dataToSubmit)
        notificationService.success('Afiliado atualizado com sucesso')
        emit('submit', dataToSubmit)
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

    watch(() => formData.value.applications, (newApplications) => {
      newApplications.forEach((app) => {
        let currentCommission = parseFloat(String(app.commission_percentage));
        let currentReleaseDays = parseInt(String(app.commission_release_days), 10);

        if (isNaN(currentCommission) && props.rules) currentCommission = props.rules.commission_percentage.min * 100;
        if (isNaN(currentReleaseDays) && props.rules) currentReleaseDays = props.rules.commission_release_days.min;

        if (props.rules) {
          const minComm = props.rules.commission_percentage.min * 100;
          const maxComm = props.rules.commission_percentage.max * 100;
          if (currentCommission < minComm) {
            app.commission_percentage = minComm;
          } else if (currentCommission > maxComm) {
            app.commission_percentage = maxComm;
          } else if (app.commission_percentage !== currentCommission && !isNaN(currentCommission)) {
            app.commission_percentage = currentCommission;
          }

          const minDays = props.rules.commission_release_days.min;
          const maxDays = props.rules.commission_release_days.max;
          if (currentReleaseDays < minDays) {
            app.commission_release_days = minDays;
          } else if (currentReleaseDays > maxDays) {
            app.commission_release_days = maxDays;
          } else if (app.commission_release_days !== currentReleaseDays && !isNaN(currentReleaseDays)) {
            app.commission_release_days = currentReleaseDays;
          }
        }
      });
    }, { deep: true });

    onMounted(() => {
      if (props.show) {
        loadAffiliateData()
      }
      loadApplications()
    })

    return {
      formData,
      loading,
      error,
      activeTab,
      tabs,
      openDropdowns,
      isFormValid,
      getDropdownOptions,
      handleApplicationSelect,
      getSelectedAppName,
      getSelectedAppLogo,
      handleImageError,
      getCommissionError,
      getReleaseDaysError,
      handleBlurValidation,
      addApp,
      removeApp,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.nav-btn {
  transition: color 0.3s ease-in-out;
  cursor: pointer;
  color: #666;
  outline: none;
}

.nav-btn:focus {
  outline: none;
  box-shadow: none;
}

.nav-btn:hover {
  color: #2196f3;
}

.nav-btn.active {
  color: #2196f3;
}

.chevron-icon {
  transition: transform 0.2s ease-in-out;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

::v-deep input[type="number"]::-webkit-inner-spin-button,
::v-deep input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
</style>