import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, LoginCredentials, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Inicializa o estado do localStorage
  const initializeAuth = () => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth', credentials)
      const data = response.data

      console.log('Login response data:', data)

      // Armazena no state
      user.value = data.user
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken

      // Persiste no localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // Refresh token
  const refresh = async (): Promise<void> => {
    if (!refreshToken.value) {
      throw new Error('Sem refresh token disponível')
    }

    loading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth/refresh-token', {
        refreshToken: refreshToken.value,
      })
      const data = response.data

      // Atualiza tokens
      user.value = data.user
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao renovar token'
      await logout() // Se refresh falhar, faz logout
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,

    isAuthenticated,
    currentUser,

    login,
    logout,
    refresh,
    initializeAuth,
  }
})
