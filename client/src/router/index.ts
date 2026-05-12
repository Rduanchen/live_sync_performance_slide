import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/admin-login',
      name: 'AdminLogin',
      component: () => import('../views/AdminLogin.vue')
    },
    {
      path: '/admin-panel',
      name: 'AdminPanel',
      component: () => import('../views/AdminPanel.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('adminToken')
    if (token) {
      next()
    } else {
      next('/admin-login')
    }
  } else {
    next()
  }
})

export default router
