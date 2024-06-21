import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: (): State => {
    return {
      isSidebarOpen: false,
    }
  },
})