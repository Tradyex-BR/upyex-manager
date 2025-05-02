<template>
  <aside className="min-w-[272px] max-md:w-full max-md:ml-0">
    <div className="border-r-[color:var(--Borda,#222A3F)] w-full h-full whitespace-nowrap border-r border-solid">
      <div
        className="text-2xl font-bold font-inter flex self-stretch justify-center items-center h-[80px] w-full gap-2.5 overflow-hidden text-[rgba(185,89,25,1)] text-center p-6">
        TRADYEX
      </div>
      <nav className="w-full pt-10 px-6 max-md:pb-[100px] max-md:px-5">
        <div className="flex gap-2 w-full flex-col items-stretch">
          <p class="text-sm text-[#8A99AF] font-medium pl-[15px]">
            MENU
          </p>
          <div class="self-stretch flex flex-col justify-start gap-6">
            <template v-for="(item, index) in menuItems" :key="index">
              <router-link v-slot="{ navigate }" :to="item.route" v-if="item.visible" custom>
                <li
:class="{
                  'bg-[rgba(207,99,28,0.16)] text-[#CF631C]': isCurrentRoute(item.route),
                  'bg-transparent text-[#DEE4EE]': !isCurrentRoute(item.route),
                  'flex w-full items-center': true,
                  'justify-between': isCurrentRoute(item.route),
                  'gap-2.5': !isCurrentRoute(item.route),
                  'pl-4 pr-3 py-2 rounded-[3px]': true,
                  'cursor-pointer': true
                }" @click="navigate">
                  <div class="self-stretch flex items-center gap-2.5 my-auto">
                    <div class="self-stretch flex w-6 shrink-0 h-6 my-auto">
                      <menu-icons :name="item.icon" />
                    </div>
                    <div class="font-inter text-[16px] leading-5 self-stretch my-auto">
                      {{ item.text }}
                    </div>
                  </div>
                  <div v-if="isCurrentRoute(item.route)" class="self-stretch flex w-6 shrink-0 h-6 my-auto" />
                </li>
              </router-link>
            </template>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import MenuIcons from '@/components/icons/MenuIcons.vue'

interface MenuItem {
  text: string
  route: string
  icon: string
}

export default defineComponent({
  name: 'Sidebar',
  components: {
    MenuIcons
  },
  setup() {
    const route = useRoute()

    const isCurrentRoute = (path: string) => {
      return route.path === path
    }

    return {
      isCurrentRoute,
    }
  },
  data() {
    const role = localStorage.getItem('role')

    return {
      menuItems: [
        { 
          text: 'Dashboard', 
          route: '/dashboard',
          icon: 'svg-dashboard',
          visible: true
        },

        { 
          text: 'Afiliados', 
          route: '/affiliates',
          icon: 'svg-vendas',
          visible: role === 'manager'
        },
        { 
          text: 'Vendas', 
          route: '/sales',
          icon: 'svg-ofertas',
          visible: true
        },
        { 
          text: 'Ofertas', 
          route: '/offers',
          icon: 'svg-ofertas',
          visible: role == 'affiliate'
        },
        { 
          text: 'Saques', 
          route: '/withdrawals',
          icon: 'svg-saques',
          visible: true
        },
     
        { 
          text: 'Usuários', 
          route: '/customers',
          icon: 'svg-users',
          visible: role === 'manager'
        }
      ] as MenuItem[]
    }
  }
})
</script>