import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, LoginCredentials, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Verifica se o usuário está autenticado (token está nos cookies)
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Chama endpoint /me para obter dados do usuário, o backend irá ler o cookie automaticamente
      const response = await api.get<User>('/auth/me')
      if (response.data) {
        user.value = response.data
        return true
      }
      return false
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err)
      user.value = null
      return false
    }
  }

  // Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth', credentials)
      const data = response.data
      user.value = data.user
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    try {
      // Chama endpoint de logout no backend para limpar cookies
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      user.value = null
      error.value = null
    }
  }

  return {
    user,
    loading,
    error,

    isAuthenticated,
    currentUser,

    login,
    logout,
    checkAuth,
  }
})
