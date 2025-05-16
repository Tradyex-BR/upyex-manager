  <template>
    <header
      class="h-[80px] items-center border-b-[color:var(--Borda,#222A3F)] bg-[#040D25] flex min-h-20 w-full text-sm flex-wrap px-8 border-b border-solid">
      <div class="self-stretch my-auto flex h-min min-w-60 items-center gap-3 flex-1">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/5697248805177b7c44034604d6594552a9fa39ff?placeholderIfAbsent=true"
          class="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" alt="Search icon" />
        <input v-model="searchQuery" type="text" placeholder="Digite para pesquisar"
          :class="['text-[#B8B8B8] text-sm leading-5 self-stretch my-auto bg-transparent border-none outline-none w-full', searchDisabled ? 'cursor-not-allowed opacity-60' : '']"
          @keyup.enter="emitSearch" :disabled="searchDisabled" />
      </div>
      <div
        class="justify-end font-inter cursor-not-allowed text-[14px] leading-5 self-stretch flex min-w-60 items-center gap-[30px] text-white my-auto">
        <!-- <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/af02ba544c49dcfe6925b9408f10a84e26e396f2?placeholderIfAbsent=true"
          class="aspect-[2.44] object-contain w-[83px] self-stretch shrink-0" alt="Notifications" /> -->
        <div class="relative">
          <div class="self-stretch flex items-stretch gap-[10px] my-auto cursor-pointer">
            <BaseDropdown :options="[
              {
                text: 'Sair',
                icon: FontAwesomeIcon,
                iconProps: { icon: faRightFromBracket },
                action: 'logout'
              }
            ]" v-model="isDropdownOpen" @select="handleDropdownAction"
              class="flex items-center w-full outline-none border-none focus:outline-none focus:ring-0 p-0">
              <template #trigger>
                <div class="flex items-center justify-end gap-[15px] w-full">
                  <div class="flex items-center gap-1">
                    <p
                      class="font-inter text-[#FFF] text-[14px] leading-[18px] grow my-auto truncate overflow-hidden whitespace-nowrap">
                      {{ authStore.user?.name || 'Usuário' }}
                    </p>
                  </div>


                  <img
                    :src="getImageUrl(authStore.user?.name || 'Usuário', authStore.user?.avatar_path)"
                    class="aspect-[1.65] object-contain w-[46px] h-[46px] rounded-full shrink-0 bg" alt="User avatar"
                    @error="(e) => handleImageError(e, authStore.user?.name || 'Usuário')"
                  />

                  <svg :class="['w-5 h-5 transition-transform', { 'rotate-180': isDropdownOpen }]"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.41074 6.9107C4.73618 6.58527 5.26382 6.58527 5.58926 6.9107L10 11.3214L14.4107 6.9107C14.7362 6.58527 15.2638 6.58527 15.5893 6.9107C15.9147 7.23614 15.9147 7.76378 15.5893 8.08921L10.5893 13.0892C10.2638 13.4146 9.73618 13.4146 9.41075 13.0892L4.41074 8.08921C4.08531 7.76378 4.08531 7.23614 4.41074 6.9107Z"
                      fill="#637381" />
                  </svg>
                </div>
              </template>
            </BaseDropdown>
          </div>
        </div>
      </div>
    </header>
  </template>

<script setup lang="ts">
import { computed, ref, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logger } from '@/config/logger'
import { notificationService } from '@/services/notificationService'
import { getImageUrl, handleImageError } from '@/utils/imageUtils'

const route = useRoute()
const searchDisabled = computed(() => route.path === '/dashboard') // ajuste para o path correto se necessário

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const isDropdownOpen = ref(false)

// Watch para limpar a pesquisa quando mudar de rota
watch(() => route.path, () => {
  searchQuery.value = ''
  emit('search', '')
})

// Função de debounce
const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Criar versão com debounce do emitSearch
const debouncedEmitSearch = debounce((value: string) => {
  if (value.trim() !== '') {
    emit('search', value.trim())
  }
}, 300) // 300ms de delay

// Adicionar watch para searchQuery com debounce
watch(searchQuery, (newValue) => {
  debouncedEmitSearch(newValue)
})

const handleDropdownAction = async (action: string) => {
  if (action === 'logout') {
    await handleLogout()
  }
}

const handleLogout = async () => {
  try {
    isDropdownOpen.value = false
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    logger.error('Erro ao fazer logout:', error)
    notificationService.error('Erro ao fazer logout')
  }
}

const emitSearch = () => {
  logger.info('emitSearch (TopBar) enviando:', searchQuery.value)
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    // Emite o evento para o pai
    // @ts-ignore
    emit('search', searchQuery.value.trim())
  }
}

// Adiciona o emit ao setup
const emit = defineEmits(['search'])

onUnmounted(() => {
  // Remover o event listener já que agora é gerenciado pelo BaseDropdown
})

</script>
