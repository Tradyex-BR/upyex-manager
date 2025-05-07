<template>
  <component :is="iconComponent" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import DashboardIcon from './DashboardIcon.vue'
import VendasIcon from './VendasIcon.vue'
import OfertasIcon from './OfertasIcon.vue'
import SaquesIcon from './SaquesIcon.vue'
import UsersIcon from './UsersIcon.vue'
import AffiliatesIcon from './AffiliatesIcon.vue'
import ApplicationsIcon from './ApplicationsIcon.vue'

export default defineComponent({
  name: 'MenuIcons',
  components: {
    DashboardIcon,
    VendasIcon,
    OfertasIcon,
    SaquesIcon,
    UsersIcon,
    AffiliatesIcon,
    ApplicationsIcon
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const iconComponent = computed(() => {
      switch (props.name) {
        case 'svg-dashboard':
          return 'DashboardIcon'
        case 'svg-vendas':
          return 'VendasIcon'
        case 'svg-ofertas':
          return 'OfertasIcon'
        case 'svg-saques':
          return 'SaquesIcon'
        case 'svg-users':
          return 'UsersIcon'
        case 'svg-affiliates':
          return 'AffiliatesIcon'
        case 'svg-applications':
          return 'ApplicationsIcon'
        default:
          return null
      }
    })

    return {
      iconComponent
    }
  }
})
</script>