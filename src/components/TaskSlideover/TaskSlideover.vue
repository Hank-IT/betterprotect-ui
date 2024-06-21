<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Tasks
        </template>

        <template #default>
          <ul role="list" class="divide-y divide-gray-100">
            <li v-for="task in tasks" :key="task.id" class="relative py-5 hover:bg-gray-50">
              <div class="px-4 sm:px-6 lg:px-8">
                <div class="mx-auto flex max-w-4xl justify-between gap-x-6">
                  <div class="flex min-w-0 gap-x-4">
                    <div class="min-w-0 flex-auto">
                      <p class="text-sm font-semibold leading-6 text-gray-900">
                        <span>
                          <span class="absolute inset-x-0 -top-px bottom-0" />
                          {{ task.task }}
                        </span>
                      </p>
                      <p class="mt-1 flex text-xs leading-5 text-gray-500">
                        <span class="relative truncate hover:underline">{{ task.username }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="flex shrink-0 items-center gap-x-4">
                    <div class="hidden sm:flex sm:flex-col sm:items-end">
                      <p class="text-sm leading-6 text-gray-900">
                        <template v-if="task.status == 1">
                          Running
                        </template>
                        <template v-else-if="task.status == 2">
                          Failed
                        </template>
                        <template v-else-if="task.status == 3">
                          Finished
                        </template>
                        <template v-else-if="task.status == 4">
                          Queued
                        </template>
                      </p>
                      <p class="mt-1 text-xs leading-5 text-gray-500">
                        <template v-if="task.status == 1">
                          Started <time :datetime="task.started_at" :title="fromISOToLocalDateTimeString(task.started_at)" class="flex-none text-xs text-gray-500">
                          {{ fromISOToRelativeString(task.started_at) }}</time>
                        </template>
                        <template v-else-if="task.status == 2 || task.status == 3">
                          Finished <time :datetime="task.ended_at" :title="fromISOToLocalDateTimeString(task.ended_at)" class="flex-none text-xs text-gray-500">
                          {{ fromISOToRelativeString(task.ended_at) }}</time>
                        </template>
                        <template v-else-if="task.status == 4">
                          Queued <time :datetime="task.created_at" :title="fromISOToLocalDateTimeString(task.created_at)" class="flex-none text-xs text-gray-500">
                          {{ fromISOToRelativeString(task.created_at) }}</time>
                        </template>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
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
import { TaskIndexRequest, TaskIndexResponse } from '@/api/requests/tasks/TaskIndexRequest'
import useDateHandling from '@/composables/useDateHandling'
import useListenForEventsOnBus from '@/domain/eventBus/composables/useListenForEventsOnBus'
import UserTaskEventBus from '@/domain/eventBus/channels/UserTaskEventBus'
import TaskCreatedEvent from '@/domain/eventBus/events/TaskCreatedEvent'
import type EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract'
import EventBusSubscriber from '@/domain/eventBus/EventBusSubscriber'
import TaskFailedEvent from '@/domain/eventBus/events/TaskFailedEvent'
import TaskFinishedEvent from '@/domain/eventBus/events/TaskFinishedEvent'
import TaskProgressEvent from '@/domain/eventBus/events/TaskProgressEvent'
import TaskStartedEvent from '@/domain/eventBus/events/TaskStartedEvent'

const props = defineProps({
    modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue', 'success'])

const {fromISOToRelativeString, fromISOToLocalDateTimeString} = useDateHandling()

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

useListenForEventsOnBus(
        [
                new EventBusSubscriber(
                        [
                                new TaskCreatedEvent,
                                new TaskFailedEvent,
                                new TaskFinishedEvent,
                                new TaskProgressEvent,
                                new TaskStartedEvent(),
                        ],
                        (event: EventBusEventContract, payload?: any) => {
                            console.log(payload)
                            loadTasks()
                        }
                ),
        ],
        UserTaskEventBus.NAME,
)
</script>