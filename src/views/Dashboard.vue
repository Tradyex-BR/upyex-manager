<template>
  <div class=" overflow-hidden">
      <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
        <main class="w-full max-md:w-full max-md:ml-0">
          <div class="w-full max-md:max-w-full">
            <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
              <DashboardCards />
              <div class="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
                <AssetTable />
                <AffiliateTable />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
</template>

<script setup lang="ts">
import DashboardCards from "@/components/layout/dashboard/DashboardCards.vue";
import AssetTable from "@/components/layout/dashboard/AssetTable.vue";
import AffiliateTable from "@/components/layout/dashboard/AfilliateTable.vue";
</script> 