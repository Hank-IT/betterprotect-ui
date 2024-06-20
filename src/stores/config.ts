import { defineStore } from 'pinia'
export const useConfigStore = defineStore('store', {
  state: (): State => {
    return {
      server: '',
      websocketKey: '',
    }
  },
})