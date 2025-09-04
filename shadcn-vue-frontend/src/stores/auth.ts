import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import to from 'await-to-js'

type User = {
  id: any,
  email: string,
  name: string,
  status: string,
  serveNumber: any,
}

type LoginResponse = {
  token: string,
  user: User,
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: { email: string, password: string }): Promise<boolean> => {
    const [error, response] = await to(api.post<LoginResponse>('/auth/login', credentials))
    if (error != null) {
      console.error('Login failed:', error)
      return false
    }

    const { token: authToken, user: userData } = response.data
    token.value = authToken
    user.value = userData
    localStorage.setItem('token', authToken)
    return true
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const me = async (): Promise<void> => {
    if (!token.value) return

    const [error, response] = await to(api.get<User>('/auth/me'))
    if (error != null) {
      console.error('Failed to fetch user:', error)
      logout()
      return
    }

    user.value = response.data
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    me,
  }
})
