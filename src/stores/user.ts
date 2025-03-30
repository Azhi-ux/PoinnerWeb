import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserProfile {
  id: number
  username: string
  role: 'student' | 'company' | 'admin'
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<UserProfile | null>(null)
  const isLoggedIn = ref(false)

  const login = (user: UserProfile) => {
    currentUser.value = user
    isLoggedIn.value = true
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    logout
  }
})