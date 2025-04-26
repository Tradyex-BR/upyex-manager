<template>
  <div class=" overflow-hidden">
    <div class="gap-5 flex max-md:flex-col max-md:items-stretch">
      <main class="w-full max-md:w-full max-md:ml-0">
        <div class="w-full max-md:max-w-full">
          <section class=" min-h-[944px] w-full overflow-hidden max-md:max-w-full max-md:px-5">
            <div class="flex justify-between items-center mb-6">
              <p class="text-white text-2xl font-semibold">Users</p>
              <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                New User
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-white border-collapse">
                <thead>
                  <tr class="bg-[#1A1F3C]">
                    <th class="p-4 text-left">Name</th>
                    <th class="p-4 text-left">Email</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Registration Date</th>
                    <th class="p-4 text-left">Last Access</th>
                    <th class="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id" class="border-b border-[#1A1F3C]">
                    <td class="p-4">{{ user.name }}</td>
                    <td class="p-4">{{ user.email }}</td>
                    <td class="p-4">
                      <span :class="getStatusClass(user.status)">{{ user.status }}</span>
                    </td>
                    <td class="p-4">{{ user.registrationDate }}</td>
                    <td class="p-4">{{ user.lastAccess }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button 
                          @click="toggleDropdown(user.id)"
                          class="px-3 py-1 bg-[#1A1F3C] rounded-lg hover:bg-[#2A2F4C] transition-colors"
                        >
                          Actions
                        </button>
                        <div 
                          v-if="dropdownOpen === user.id"
                          class="absolute right-0 mt-2 w-48 bg-[#1A1F3C] rounded-lg shadow-lg z-10"
                        >
                          <button 
                            @click="handleAction(user.id, 'block')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-yellow-500"
                          >
                            Block
                          </button>
                          <button 
                            @click="handleAction(user.id, 'edit-permission')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-blue-500"
                          >
                            Edit Permission
                          </button>
                          <button 
                            @click="handleAction(user.id, 'reset-password')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-purple-500"
                          >
                            Reset Password
                          </button>
                          <button 
                            @click="handleAction(user.id, 'delete')"
                            class="w-full text-left px-4 py-2 hover:bg-[#2A2F4C] text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastAccess: string;
}

export default defineComponent({
  name: 'Users',
  components: {
    Sidebar,
    TopBar
  },
  data() {
    return {
      users: [] as User[],
      dropdownOpen: null as number | null
    }
  },
  methods: {
    getStatusClass(status: string): string {
      const classes = {
        'Active': 'px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-500',
        'Blocked': 'px-2 py-1 rounded-full text-sm bg-red-500/20 text-red-500'
      }
      return classes[status as keyof typeof classes] || ''
    },
    toggleDropdown(id: number) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id
    },
    handleAction(id: number, action: string) {
      // Implement logic for each action here
      console.log(`Action ${action} for user ${id}`)
      this.dropdownOpen = null
    },
    loadUsers() {
      this.users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 3,
          name: 'Bob Smith',
          email: 'email@email.com',
          status: 'Blocked',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 4,
          name: 'Alice Johnson',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 5,
          name: 'Megan Brown',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 6,
          name: 'Elizabeth Green',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        },
        {
          id: 7,
          name: 'Gabrielle White',
          email: 'email@email.com',
          status: 'Active',
          registrationDate: '03/12/2025',
          lastAccess: '03/12/2025 14:21'
        }
      ]
    }
  },
  mounted() {
    this.loadUsers()
    // Close the dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        this.dropdownOpen = null
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', () => {})
  }
})
</script>