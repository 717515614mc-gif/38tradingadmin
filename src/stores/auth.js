import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      if (response.code === 200) {
        token.value = response.data.token
        user.value = response.data
        
        localStorage.setItem('admin_token', token.value)
        localStorage.setItem('admin_user', JSON.stringify(user.value))
        
        return response
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      throw error
    }
  }
  
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      return response
    } catch (error) {
      throw error
    }
  }
  
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }
  
  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})
