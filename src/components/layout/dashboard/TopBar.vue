  <template>
    <header class="items-center border-b-[color:var(--Borda,#222A3F)] bg-[#040D25] flex min-h-20 w-full text-sm flex-wrap px-8 py-[17px] border-b border-solid max-md:max-w-full max-md:px-5">
      <div class="self-stretch flex min-w-60 items-center gap-3 text-[#B8B8B8] font-normal leading-none flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/5697248805177b7c44034604d6594552a9fa39ff?placeholderIfAbsent=true"
          class="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
          alt="Search icon"
        />
        <input
          type="text"
          placeholder="Digite para pesquisar"
          v-model="searchQuery"
          class="self-stretch my-auto bg-transparent border-none outline-none w-full"
        />
      </div>
      <div class="self-stretch flex min-w-60 items-center gap-8 text-white font-medium text-right leading-none my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/af02ba544c49dcfe6925b9408f10a84e26e396f2?placeholderIfAbsent=true"
          class="aspect-[2.44] object-contain w-[83px] self-stretch shrink-0 my-auto"
          alt="Notifications"
        />
        <div class="relative">
          <div 
            class="self-stretch flex items-stretch gap-[15px] w-[193px] my-auto cursor-pointer"
            @click="toggleDropdown"
          >
            <div class="grow my-auto">{{ authStore.currentUser?.name || 'Usuário' }}</div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/7f72b52c1e064ab59dcec351fcad2273/96e7f41f7be79a401e7a632d173b4a0468526db3?placeholderIfAbsent=true"
              class="aspect-[1.65] object-contain w-[76px] shrink-0"
              alt="User avatar"
            />
            <svg 
              :class="['w-4 h-4 transition-transform', { 'rotate-180': isDropdownOpen }]"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Dropdown Menu -->
          <div 
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sair
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
    if (!target.closest('.relative')) {
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
