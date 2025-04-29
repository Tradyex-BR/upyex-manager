import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/email-sent',
    name: 'EmailSent',
    component: () => import('../views/EmailSent.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/password-changed',
    name: 'PasswordChanged',
    component: () => import('../views/PasswordChanged.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/Sales.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/offers',
    name: 'Offers',
    component: () => import('../views/Offers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/withdrawals',
    name: 'Withdrawals',
    component: () => import('../views/Withdrawals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rotas
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      next('/login')
    } else {
      // Proteção para afiliados não acessarem /users
      if (to.path === '/users' && authStore.user?.role === 'AFFILIATE') {
        next('/dashboard')
      } else {
        next()
      }
    }
  } else {
    if (authStore.isAuthenticated && to.path === '/login') {
      next('/dashboard')
    } else {
      next()
    }
  }
})

export default router 