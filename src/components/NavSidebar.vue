<template>
    <TransitionRoot as="template" :show="appStore.isSidebarOpen">
        <Dialog class="relative z-50 lg:hidden" @close="appStore.isSidebarOpen = false">
            <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
                             enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                             leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div class="fixed inset-0 flex">
                <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                                 enter-from="-translate-x-full" enter-to="translate-x-0"
                                 leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                                 leave-to="-translate-x-full">
                    <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                        <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                         enter-to="opacity-100" leave="ease-in-out duration-300"
                                         leave-from="opacity-100" leave-to="opacity-0">
                            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" class="-m-2.5 p-2.5" @click="appStore.isSidebarOpen = false">
                                    <span class="sr-only">Close sidebar</span>
                                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <!-- Sidebar component, swap this element with another sidebar if you like -->

                        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                            <div class="flex h-16 shrink-0 items-center">
                                <img class="h-8 w-auto" src="/logo.png" alt="Betterprotect" />
                                <span class="ml-5">Betterprotect</span>
                            </div>
                            <nav class="flex flex-1 flex-col">
                                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" class="-mx-2 space-y-1">
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'server.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Server</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   :class="[false ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                                                    Log Viewer
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                   :class="[false ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                                                    Charts
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div class="text-xs font-semibold leading-6 text-gray-400">Policy</div>
                                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.rules.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Rules</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.recipients.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Recipients</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.transports.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Transports</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.relay-domains.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Relay domains</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.milter.index' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Milter definitions</a>
                                                </RouterLink>
                                            </li>
                                            <li>
                                                <RouterLink
                                                        v-slot="{ href, navigate, isActive }"
                                                        :to="{ name: 'policy.milter.exceptions' }"
                                                        custom
                                                >
                                                    <a
                                                            :href="href"
                                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                                            @click="navigate"
                                                    >Milter exceptions</a>
                                                </RouterLink>
                                            </li>
                                        </ul>
                                    </li>
                                    <li v-if="auth.check(['administrator'])" class="mt-auto">
                                        <RouterLink
                                                v-slot="{ href, navigate, isActive }"
                                                :to="{ name: 'users' }"
                                                custom
                                        >
                                            <a
                                                    :href="href"
                                                    :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md text-sm font-semibold leading-6']"
                                                    @click="navigate"
                                            >User management</a>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div class="flex h-16 shrink-0 items-center">
                <img class="h-8 w-auto" src="/logo.png" alt="Betterprotect" />
                <span class="ml-5">Betterprotect</span>
            </div>
            <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" class="-mx-2 space-y-1">
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'server.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Server</a>
                                </RouterLink>
                            </li>
                            <li>
                                <a href="#"
                                   :class="[false ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                                    Log Viewer
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                   :class="[false ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                                    Charts
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div class="text-xs font-semibold leading-6 text-gray-400">Policy</div>
                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.rules.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Rules</a>
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.recipients.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Recipients</a>
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.transports.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Transports</a>
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.relay-domains.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Relay domains</a>
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.milter.index' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Milter definitions</a>
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink
                                        v-slot="{ href, navigate, isActive }"
                                        :to="{ name: 'policy.milter.exceptions' }"
                                        custom
                                >
                                    <a
                                            :href="href"
                                            :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']"
                                            @click="navigate"
                                    >Milter exceptions</a>
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li v-if="auth.check(['administrator'])" class="mt-auto">
                        <RouterLink
                                v-slot="{ href, navigate, isActive }"
                                :to="{ name: 'users' }"
                                custom
                        >
                            <a
                                    :href="href"
                                    :class="[isActive ? 'bg-gray-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600', 'group flex gap-x-3 rounded-md text-sm font-semibold leading-6']"
                                    @click="navigate"
                            >User management</a>
                        </RouterLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

const appStore = useAppStore()

const auth = useAuthStore()

const router = useRouter();

router.afterEach((to, from) => {
    appStore.isSidebarOpen = false
});
</script>