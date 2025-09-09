import { useAuthStore } from '@/stores/auth'
import CreateQueue from '@/views/CreateQueue.vue'
import Dashboard from '@/views/Dashboard.vue'
import DisplayQueue from '@/views/DisplayQueue.vue'
import Login from '@/views/Login.vue'
import Queue from '@/views/Queue.vue'
import Users from '@/views/Users.vue'
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
    {
      path: '/users',
      component: Users,
      meta: { requireAuth: true }
    },
    {
      path: '/queue',
      component: Queue,
      meta: { requireAuth: true }
    },
    {
      path: '/create_queue',
      component: CreateQueue,
      meta: { requireGuest: true }
    },
    {
      path: '/display_queue',
      component: DisplayQueue,
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
