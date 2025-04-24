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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vendas',
    name: 'Vendas',
    component: () => import('../views/Vendas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ofertas',
    name: 'Ofertas',
    component: () => import('../views/Ofertas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/saques',
    name: 'Saques',
    component: () => import('../views/Saques.vue'),
    meta: { requiresAuth: true }
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
      next()
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