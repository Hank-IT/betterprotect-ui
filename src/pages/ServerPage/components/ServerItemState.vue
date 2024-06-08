<template>
    <div class="relative ml-auto">
        <div v-if="request.isLoading()">
            <span class="text-gray-700 italic">Checking server state...</span>
        </div>
        <div @click="isOpen = true" v-else class="cursor-pointer">
            <div v-if="alertCount > 0" class="flex">
                <div class="flex-shrink-0">
                    <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-1">
                    <div class="text-sm font-medium text-red-800">{{ alertCount }} {{ alertCount === 1 ? 'alert' : 'alerts' }}</div>
                </div>
            </div>
            <div v-else-if="alertCount === 0">
                <div class="flex-shrink-0">
                    <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div class="ml-1">
                    <div class="text-sm font-medium text-green-800">No alerts</div>
                </div>
            </div>
        </div>
    </div>

    <BSlideover v-model="isOpen" >
        <template #title>
            Server state
        </template>

        <template #default>
            <div class="relative flex-1 px-4 py-6 sm:px-6">
                <ul role="list" class="divide-y divide-gray-100">
                    <li v-for="alert in alerts" :key="alert.key" class="py-4">
                        <div class="flex items-center gap-x-3">
                            <h3 class="flex-auto truncate text-sm font-semibold leading-6" :class="[ alert.available ? 'text-green-700': 'text-red-700' ]">{{ alert.key }}</h3>
                            <time :datetime="alert.timestamp" :title="fromISOToLocalDateTimeString(alert.timestamp)" class="flex-none text-xs text-gray-500">{{ fromISOToRelativeString(alert.timestamp) }}</time>
                        </div>
                        <p class="mt-3 text-sm text-gray-500">
                            {{ alert.description }}
                        </p>
                    </li>
                </ul>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import {CheckCircleIcon, XCircleIcon} from '@heroicons/vue/20/solid'
import {ServerStateRequest} from '@/api/requests/servers/ServerStateRequest'
import {ref} from 'vue'
import type {ServerResource} from '@/api/requests/servers/ServerIndexRequest'
import BSlideover from '@/ui/BSlideover.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import useDateHandling from '@/composables/useDateHandling'
const {fromISOToRelativeString, fromISOToLocalDateTimeString} = useDateHandling()

const props = defineProps({
    server: Object as ServerResource,
})

const request = new ServerStateRequest(props.server.id)

const alerts = ref([])
const alertCount = ref()

const {isOpen} = useIsOpen()

request
    .send()
    .then(response => {
        const state = response.getData()

        alerts.value = state
        alertCount.value = state.filter(item => !item.available).length
    })
</script>