<template>
        <div class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
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
                    <button @click="taskStore.isSlideoverOpen = true" type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span class="sr-only">View tasks</span>
                        <BellIcon class="h-6 w-6" aria-hidden="true" />
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
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import { Bars3Icon, BellIcon, } from '@heroicons/vue/24/outline'
import TaskSlideover from '@/components/TaskSlideover/TaskSlideover.vue'
import { useAuthStore } from '@/stores/auth'
import { UserLogoutRequest } from '@/api/requests/auth/UserLogoutRequest'
import { useRouter } from 'vue-router'
import InstallPolicySlideover from '@/components/InstallPolicySlideover.vue'
import {useIsOpen} from '@hank-it/ui/vue'

const sidebarOpen = ref(false)

const taskStore = useTaskStore()

const auth = useAuthStore()

const userLogoutRequest = new UserLogoutRequest()

const {isOpen: isInstallPolicySlideoverOpen, isOpenKey: installPolicySlideoverKey} = useIsOpen()

const router = useRouter()

function logout() {
    userLogoutRequest.send().then(() => {
        auth.user = undefined

        router.push({ name: 'login' })
    }).catch(exception => {
        //
    })
}
</script>