<template>
  <div class="bg-[#040D25] overflow-hidden">
      <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
        <Sidebar />
        <main class="w-[81%] ml-5 max-md:w-full max-md:ml-0">
          <div class="w-full max-md:max-w-full">
            <TopBar />
            <section class="bg-[#040D25] min-h-[944px] w-full overflow-hidden pt-8 pb-20 px-8 max-md:max-w-full max-md:px-5">
              <p>Saques</p>
            </section>
          </div>
        </main>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/layout/dashboard/Sidebar.vue'
import TopBar from '@/components/layout/dashboard/TopBar.vue'

export default defineComponent({
  name: 'Saques',
  components: {
    Sidebar,
    TopBar
  }
})
</script> 