import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { RouteRecordRaw } from 'vue-router'
import Offers from '@/views/Offers.vue'
import EditOffer from '@/views/offers/EditOffer.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Sales from '@/views/Sales.vue'
import Affiliates from '@/views/Affiliates.vue'
import EditAffiliate from '@/views/affiliates/EditAffiliate.vue'
import EditCustomer from '@/views/customers/EditCustomer.vue'

const routes: Array<RouteRecordRaw> = [
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
    path: '/affiliates',
    name: 'Affiliates',
    component: () => import('../views/Affiliates.vue'),
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
    name: 'offers',
    component: Offers,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/offers/:id/edit',
    name: 'edit-offer',
    component: EditOffer,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/withdrawals',
    name: 'Withdrawals',
    component: () => import('../views/Withdrawals.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: () => import('../views/CustomerDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/:id/edit',
    name: 'edit-customer',
    component: EditCustomer,
    meta: { requiresAuth: true }
  },
  {
    path: '/affiliates/:id/edit',
    name: 'edit-affiliate',
    component: EditAffiliate,
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
      // Proteção para afiliados não acessarem /customers
      if (to.path === '/customers' && authStore.user?.role === 'AFFILIATE') {
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