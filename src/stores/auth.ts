import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      authenticated: false,
    }
  },
})