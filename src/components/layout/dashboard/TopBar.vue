  <template>
    <header
      class="h-[80px] items-center border-b-[color:var(--Borda,#222A3F)] bg-[#040D25] flex min-h-20 w-full text-sm flex-wrap px-8 border-b border-solid">
      <div class="self-stretch my-auto flex h-min min-w-60 items-center gap-3 flex-1">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/5697248805177b7c44034604d6594552a9fa39ff?placeholderIfAbsent=true"
          class="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" alt="Search icon" />
        <input type="text" placeholder="Digite para pesquisar" v-model="searchQuery"
          class="text-[#B8B8B8] text-sm leading-5 self-stretch my-auto bg-transparent border-none outline-none w-full" />
      </div>
      <div
        class="font-inter text-[14px] leading-5 self-stretch flex min-w-60 items-center gap-[30px] text-white my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/af02ba544c49dcfe6925b9408f10a84e26e396f2?placeholderIfAbsent=true"
          class="aspect-[2.44] object-contain w-[83px] self-stretch shrink-0" alt="Notifications" />
        <div class="border border-red-500 relative">
          <div class="self-stretch flex items-stretch gap-[10px] my-auto cursor-pointer" @click="toggleDropdown">
            <div class="flex items-center gap-[15px]">
              <p
                class="font-inter text-[#FFF] text-[14px] leading-[18px] grow my-auto truncate overflow-hidden whitespace-nowrap">
                {{ authStore.currentUser?.name || 'Usuário' }}
              </p>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/6830cfe8e1025f86c5f2361098a25b4307d4d60b?placeholderIfAbsent=true"
                class="aspect-[1.65] object-contain w-[46px] h-[46px] rounded-full shrink-0" alt="User avatar" />
            </div>
            <svg :class="['my-auto w-5 h-w-5 transition-transform', { 'rotate-180': isDropdownOpen }]"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M4.41074 6.9107C4.73618 6.58527 5.26382 6.58527 5.58926 6.9107L10 11.3214L14.4107 6.9107C14.7362 6.58527 15.2638 6.58527 15.5893 6.9107C15.9147 7.23614 15.9147 7.76378 15.5893 8.08921L10.5893 13.0892C10.2638 13.4146 9.73618 13.4146 9.41075 13.0892L4.41074 8.08921C4.08531 7.76378 4.08531 7.23614 4.41074 6.9107Z"
                fill="#637381" />
            </svg>

          </div>

          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-[#222A3F] rounded-md shadow-lg py-1 z-50">
            
            <button @click="handleLogout" class="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1147_3686)">
                  <path d="M19.0711 5.07108L4.92894 19.2132M4.92892 5.07108L19.0711 19.2132" stroke="#B8B8B8"
                    stroke-width="1.5" />
                </g>
                <defs>
                  <clipPath id="clip0_1147_3686">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="text-[#B8B8B8]">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

// Fechar o dropdown quando clicar fora
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.border-red-500')) {
    isDropdownOpen.value = false
  }
}

// Adicionar e remover o event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
