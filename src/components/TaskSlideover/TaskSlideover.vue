<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Tasks
        </template>

        <template #default>

        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Close</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper, useOnOpen} from '@hank-it/ui/vue'
import { ref } from 'vue'
import { TaskIndexRequest } from '@/api/requests/tasks/TaskIndexRequest'

const props = defineProps({
    modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const tasks = ref([])

const taskIndexRequest = new TaskIndexRequest()

function loadTasks() {
  taskIndexRequest.send()
    .then((result: TaskIndexResponse) => {
      tasks.value = result.getData()
    })
    .catch(error => {
      //
    })
}

const {onOpen} = useOnOpen(props)

onOpen(() => {
  loadTasks()
})
</script>