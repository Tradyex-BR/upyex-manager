<template>
  <aside className="w-[19%] max-md:w-full max-md:ml-0">
    <div className="border-r-[color:var(--Borda,#222A3F)] w-full whitespace-nowrap border-r border-solid">
      <div
        className="self-stretch bg-[#040D25] w-full gap-2.5 overflow-hidden text-2xl text-[rgba(185,89,25,1)] font-bold text-center leading-none p-6 max-md:px-5">
        TRADYEX
      </div>
      <nav className="bg-[#040D25] min-h-[944px] w-full pt-10 pb-[580px] px-6 max-md:pb-[100px] max-md:px-5">
        <div className="flex w-full flex-col items-stretch">
          <div className="gap-2.5 text-sm text-[#8A99AF] font-medium uppercase leading-none pl-[15px]">
            Menu
          </div>
          <div class="self-stretch flex flex-col items-start justify-start gap-2.5">
            <div v-for="(item, index) in menuItems" :key="index">
              <router-link :to="item.route" custom v-slot="{ navigate }">
                <li @click="navigate" :class="{
                  'bg-[rgba(207,99,28,0.16)] text-[#CF631C]': isCurrentRoute(item.route),
                  'bg-[#040D25]': !isCurrentRoute(item.route),
                  'flex w-full items-center': true,
                  'justify-between': isCurrentRoute(item.route),
                  'gap-2.5': !isCurrentRoute(item.route),
                  [`mt-${index === 0 ? '0' : '6'}`]: true,
                  'pl-4 pr-3 py-2 rounded-[3px]': true,
                  'cursor-pointer': true
                }">
                  <div class="self-stretch flex items-center gap-2.5 my-auto">
                    <div class="self-stretch flex w-6 shrink-0 h-6 my-auto">
                      <menu-icons :name="item.icon" />
                    </div>
                    <div class="text-sm font-medium leading-5 self-stretch my-auto">
                      {{ item.text }}
                    </div>
                  </div>
                  <div v-if="isCurrentRoute(item.route)" class="self-stretch flex w-6 shrink-0 h-6 my-auto" />
                </li>
              </router-link>
            </div>
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
      isCurrentRoute
    }
  },
  data() {
    return {
      menuItems: [
        { 
          text: 'Dashboard', 
          route: '/dashboard',
          icon: 'svg-dashboard'
        },
        { 
          text: 'Vendas', 
          route: '/vendas',
          icon: 'svg-vendas'
        },
        { 
          text: 'Ofertas', 
          route: '/ofertas',
          icon: 'svg-ofertas'
        },
        { 
          text: 'Saques', 
          route: '/saques',
          icon: 'svg-saques'
        }
      ] as MenuItem[]
    }
  }
})
</script>