<template>
    <BSlideover v-model="isOpen" @scroll="scroll" :is-loading="taskIndexRequest.isLoading()">
        <template #title>
            Tasks
        </template>

        <template #default>
            <ul role="list" class="divide-y divide-gray-100" @scroll="scroll">
                <li @click="payload = task" v-for="task in paginator.getPageData()" :key="task.id" class="relative py-5 hover:bg-gray-50">
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
                                        <span class="relative truncate">{{ task.username }}</span>
                                    </p>
                                </div>

                            </div>
                            <div class="flex shrink-0 items-center gap-x-4">
                                <div class="hidden sm:flex sm:flex-col sm:items-end">
                                    <p class="text-sm leading-6 text-gray-900">
                                        <template v-if="task.status === 1">
                                            <span class="flex items-center justify-center">
                                                <svg class="text-primary-700 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     width="16" height="16">
                                                <path
                                                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                <path
                                                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                                    stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                                </path>
                                            </svg>
                                            <span class="text-primary-700 ml-2">Running</span>
                                            </span>
                                        </template>
                                        <template v-else-if="task.status == 2">
                                            <span class="text-red-700">Failed</span>
                                        </template>
                                        <template v-else-if="task.status == 3">
                                            <span class="text-green-700">Finished</span>
                                        </template>
                                        <template v-else-if="task.status == 4">
                                            Queued
                                        </template>
                                    </p>
                                    <p class="mt-1 text-xs leading-5 text-gray-500">
                                        <template v-if="task.status == 1">
                                            Started
                                            <time :datetime="task.started_at"
                                                  :title="fromISOToLocalDateTimeString(task.started_at)"
                                                  class="flex-none text-xs text-gray-500">
                                                {{ fromISOToRelativeString(task.started_at) }}
                                            </time>
                                        </template>
                                        <template v-else-if="task.status == 2 || task.status == 3">
                                            Finished
                                            <time :datetime="task.ended_at"
                                                  :title="fromISOToLocalDateTimeString(task.ended_at)"
                                                  class="flex-none text-xs text-gray-500">
                                                {{ fromISOToRelativeString(task.ended_at) }}
                                            </time>
                                        </template>
                                        <template v-else-if="task.status == 4">
                                            Queued
                                            <time :datetime="task.created_at"
                                                  :title="fromISOToLocalDateTimeString(task.created_at)"
                                                  class="flex-none text-xs text-gray-500">
                                                {{ fromISOToRelativeString(task.created_at) }}
                                            </time>
                                        </template>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p v-if="task.progress.length > 0" class="mt-1 flex text-xs leading-5 text-gray-500">
                            <span class="relative" :class="{ 'text-red-700': task.status == 2, 'text-green-700': task.status == 3 }">{{ task.progress[0].description }}</span>
                        </p>
                    </div>
                </li>
            </ul>

            <DetailsModal v-model="isDetailsModalOpen" :payload="payload" :key="detailsModalKey" />
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button"
                        class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        @click="isOpen = false">Close
                </button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import { useModelWrapper, useOnBoolean, useIsOpenFromVar } from '@hank-it/ui/vue'
import { TaskIndexRequest } from '@/api/requests/tasks/TaskIndexRequest'
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
import { InfiniteScroller, RequestDriver } from '@hank-it/ui/service/pagination'
import { isAtBottom } from '@hank-it/ui/helpers'
import { debounce } from 'lodash'
import DetailsModal from '@/components/TaskSlideover/DetailsModal.vue'

const props = defineProps({
    modelValue: Boolean
})

const emits = defineEmits(['update:modelValue', 'success'])

const { fromISOToRelativeString, fromISOToLocalDateTimeString } = useDateHandling()

const isOpen = useModelWrapper(props, emits)

const taskIndexRequest = new TaskIndexRequest()

const paginator = new InfiniteScroller(new RequestDriver(taskIndexRequest))

const { onBoolean } = useOnBoolean(props)

const {fromVar: payload, isOpenFromVar: isDetailsModalOpen, isOpenFromVarKey: detailsModalKey} = useIsOpenFromVar()

onBoolean({
        truthy: () => {
            paginator.init(1, 10)
        },
        falsy: () => {
            paginator.flush()
        }
    }
)

const loadNextDebounced = debounce(event => {
    paginator.toNextPage()
}, 100)

function scroll(event) {
    if (isAtBottom(event.target.scrollHeight, event.target.scrollTop, event.target.clientHeight)) {
        if (paginator.getLastPage() > paginator.getCurrentPage()) {
            loadNextDebounced()
        }
    }
}

useListenForEventsOnBus(
    [
        new EventBusSubscriber(
            [
                new TaskCreatedEvent,
                new TaskFailedEvent,
                new TaskFinishedEvent,
                new TaskProgressEvent,
                new TaskStartedEvent,
            ],
            (event: EventBusEventContract, payload?: any) => {
                if (paginator.isInitialized()) {
                    paginator.refresh(1, {
                        replace: true,
                    })
                }
            }
        )
    ],
    UserTaskEventBus.NAME
)
</script>