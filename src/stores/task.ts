import { defineStore } from 'pinia'
export const useTaskStore = defineStore('task', {
  state: (): State => {
    return {
      isSlideoverOpen: false,
      tasksRunning: false,
      tasks: [],
    }
  },
})