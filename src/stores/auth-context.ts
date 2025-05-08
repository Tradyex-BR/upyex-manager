import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type UserRole = 'MANAGER' | 'AFFILIATE'

export const useAuthContextStore = defineStore('authContext', () => {
  const userRole = ref<UserRole>(localStorage.getItem('contextRole') as UserRole || 'MANAGER')

  // Salvar no localStorage sempre que o papel mudar
  watch(userRole, (newRole) => {
    localStorage.setItem('userRole', newRole)
  })

  function setUserRole(role: UserRole) {
    userRole.value = role
  }

  return {
    userRole,
    setUserRole,
  }
}) 