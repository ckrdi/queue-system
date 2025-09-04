import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Dashboard,
      meta: { requireAuth: true }
    },
    {
      path: '/login',
      component: Login,
      meta: { requireGuest: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requireGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
