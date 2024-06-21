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
  actions: {
    check(requiredRoles: string[]): boolean {
      return requiredRoles.includes(this.user.role)
    },
  },
})