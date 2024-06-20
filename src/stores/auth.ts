import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      user: undefined,
    }
  },
  getters: {
    authenticated: (state) => !!state.user
  },
})