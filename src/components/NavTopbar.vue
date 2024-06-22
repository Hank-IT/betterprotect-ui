<template>
        <div class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="appStore.isSidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div class="flex flex-1 gap-x-4 lg:gap-x-6">
                <div class="relative flex flex-1">
                    <button v-if="auth.check(['authorizer', 'editor', 'administrator'])" @click="isInstallPolicySlideoverOpen = true" type="button" class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Install Policy</button>
                </div>
                <div class="flex items-center gap-x-4 lg:gap-x-6">
                    <button @click="taskStore.isSlideoverOpen = true" type="button" class="flex -m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span v-if="taskStore.tasksRunning" class="flex justify-center items-center">
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

                            <span class="ml-2 text-primary-700">Tasks</span>
                        </span>

                       <template v-else>
                           <BriefcaseIcon class="h-6 w-6" aria-hidden="true" />
                           <span class="ml-2">Tasks</span>
                       </template>
                    </button>

                    <!-- Separator -->
                    <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                    <div>
                        <button @click="logout" type="button" class="-m-1.5 flex items-center p-1.5">
                              <span class="hidden lg:flex lg:items-center">
                                <span class="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">Logout {{ auth.user.username }}</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <TaskSlideover v-model="taskStore.isSlideoverOpen" />
            <InstallPolicySlideover v-model="isInstallPolicySlideoverOpen" :key="installPolicySlideoverKey" />
        </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/task'
import { Bars3Icon, BriefcaseIcon, } from '@heroicons/vue/24/outline'
import TaskSlideover from '@/components/TaskSlideover/TaskSlideover.vue'
import { useAuthStore } from '@/stores/auth'
import { UserLogoutRequest } from '@/api/requests/auth/UserLogoutRequest'
import { useRouter } from 'vue-router'
import InstallPolicySlideover from '@/components/InstallPolicySlideover.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import { useAppStore } from '@/stores/app'
import useListenForEventsOnBus from '@/domain/eventBus/composables/useListenForEventsOnBus'
import EventBusSubscriber from '@/domain/eventBus/EventBusSubscriber'
import TaskFailedEvent from '@/domain/eventBus/events/TaskFailedEvent'
import TaskFinishedEvent from '@/domain/eventBus/events/TaskFinishedEvent'
import TaskStartedEvent from '@/domain/eventBus/events/TaskStartedEvent'
import type EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract'
import UserTaskEventBus from '@/domain/eventBus/channels/UserTaskEventBus'
import { TaskRunningRequest } from '@/api/requests/tasks/TasksRunningRequest'

const taskStore = useTaskStore()

const auth = useAuthStore()

const userLogoutRequest = new UserLogoutRequest()

const {isOpen: isInstallPolicySlideoverOpen, isOpenKey: installPolicySlideoverKey} = useIsOpen()

const router = useRouter()

const appStore = useAppStore()

function logout() {
    userLogoutRequest.send().then(() => {
        auth.user = undefined

        router.push({ name: 'login' })
    }).catch(exception => {
        //
    })
}

const taskRunningRequest = new TaskRunningRequest

taskRunningRequest.send().then(result => {
    taskStore.tasksRunning = result.data.count > 0
}).catch(exception => {
    //
})

useListenForEventsOnBus(
        [
            new EventBusSubscriber(
                    [
                        new TaskStartedEvent(),
                    ],
                    (event: EventBusEventContract, payload?: any) => {
                        taskStore.tasksRunning = true
                    }
            ),
            new EventBusSubscriber(
                [
                    new TaskFailedEvent,
                    new TaskFinishedEvent,
                ],
                (event: EventBusEventContract, payload?: any) => {
                    taskStore.tasksRunning = false
                }
            ),
        ],
        UserTaskEventBus.NAME,
)
</script>