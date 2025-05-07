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
import { isAuthenticated, getCurrentRole, getDashboardPath, getLoginPath, getNotFoundPath, clearNonPersistentData } from '@/middleware/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    redirect: '/login/manager'
  },
  {
    path: '/login/manager',
    name: 'LoginManager',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, role: 'MANAGER' }
  },
  {
    path: '/login/affiliate',
    name: 'LoginAffiliate',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, role: 'AFFILIATE' }
  },
  {
    path: '/forgot-password',
    redirect: '/forgot-password/manager'
  },
  {
    path: '/forgot-password/manager',
    name: 'ForgotPasswordManager',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { requiresAuth: false, role: 'MANAGER' }
  },
  {
    path: '/forgot-password/affiliate',
    name: 'ForgotPasswordAffiliate',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { requiresAuth: false, role: 'AFFILIATE' }
  },
  {
    path: '/reset-password',
    redirect: '/reset-password/manager'
  },
  {
    path: '/reset-password/manager',
    name: 'ResetPasswordManager',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false, role: 'MANAGER' }
  },
  {
    path: '/reset-password/affiliate',
    name: 'ResetPasswordAffiliate',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false, role: 'AFFILIATE' }
  },
  {
    path: '/email-sent',
    redirect: '/email-sent/manager'
  },
  {
    path: '/email-sent/manager',
    name: 'EmailSentManager',
    component: () => import('../views/EmailSent.vue'),
    meta: { requiresAuth: false, role: 'MANAGER' }
  },
  {
    path: '/email-sent/affiliate',
    name: 'EmailSentAffiliate',
    component: () => import('../views/EmailSent.vue'),
    meta: { requiresAuth: false, role: 'AFFILIATE' }
  },
  {
    path: '/password-changed',
    name: 'PasswordChanged',
    component: () => import('../views/PasswordChanged.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/password-changed/manager',
    name: 'PasswordChangedManager',
    component: () => import('../views/PasswordChanged.vue'),
    meta: { requiresAuth: false, role: 'MANAGER' }
  },
  {
    path: '/password-changed/affiliate',
    name: 'PasswordChangedAffiliate',
    component: () => import('../views/PasswordChanged.vue'),
    meta: { requiresAuth: false, role: 'AFFILIATE' }
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
    path: '/applications',
    name: 'Applications',
    component: () => import('../views/Applications.vue'),
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
    path: '/404/manager',
    name: 'NotFoundManager',
    component: () => import('../views/NotFoundManager.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/404/affiliate',
    name: 'NotFoundAffiliate',
    component: () => import('../views/NotFoundAffiliate.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rotas
router.beforeEach((to, from, next) => {
  // Se a rota não existe, redireciona para a página 404 correspondente
  if (!to.matched.length) {
    next(getNotFoundPath())
    return
  }

  // Se o usuário está autenticado
  if (isAuthenticated()) {
    // Se tentar acessar uma rota de autenticação (exceto 404)
    if (to.meta.requiresAuth === false && !to.path.includes('/404')) {
      next(getDashboardPath())
      return
    }
    // Se tentar acessar uma rota protegida, permite
    next()
    return
  }

  // Se o usuário não está autenticado
  // Se a rota requer autenticação, redireciona para o login
  if (to.meta.requiresAuth) {
    clearNonPersistentData()
    next(getLoginPath())
    return
  }

  // Se não requer autenticação, permite
  next()
})

export default router 