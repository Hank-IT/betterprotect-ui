<template>
    <li class="overflow-hidden rounded-xl border border-gray-200">
        <div class="flex relative items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <div v-if="serverDeleteRequest.isLoading()" class="absolute w-full top-0 right-0">
                <ProgressLoader/>
            </div>

            <div class="text-sm font-medium leading-6 text-gray-900">{{ server.hostname }}</div>

            <ServerItemState :server="server" />
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div class="flex justify-between gap-x-4 py-3">
                <dt class="text-gray-500">Policy</dt>
                <dd class="text-gray-700">
                    <time :datetime="server.last_policy_install">
                        <template v-if="server.last_policy_install">
                            <span :title="fromISOToLocalDateTimeString(server.last_policy_install)">{{ fromISOToRelativeString(server.last_policy_install) }}</span>
                        </template>
                        <template v-else>
                            <span class="text-gray-700 italic">Never pushed</span>
                        </template>
                    </time>
                </dd>
            </div>
            <div class="flex justify-between gap-x-4 py-3">
                <dt class="text-gray-500">Monitoring</dt>
                <dd class="text-gray-700">
                    <time :datetime="server.monitored_at">
                        <template v-if="server.monitored_at">
                            <span :title="fromISOToLocalDateTimeString(server.monitored_at)">{{ fromISOToRelativeString(server.monitored_at) }}</span>
                        </template>
                        <template v-else>
                            <span class="text-gray-700 italic">Never monitored</span>
                        </template>
                    </time>
                </dd>
            </div>
            <ServerItemQueueCount :server="server" />
            <div class="flex justify-end gap-x-4 py-3">
                <button
                        @click="router.push({ name: 'server.edit', params: { id: server.id } })"
                        type="button"
                        class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    Edit
                </button>
                <button @click="isOpen = true"
                        type="button"
                        class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                    Delete
                </button>
            </div>
        </dl>
    </li>

    <BDialog v-model="isOpen">
        <template #title>
            Delete server
        </template>

        <template #icon>
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
        </template>

        <template #description>

            <div class="mt-2">
                <p class="text-sm text-gray-500">Are you sure you want to delete this server?. This action cannot be undone.</p>
            </div>
        </template>

        <template #footer>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="deleteServer">Delete</button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="isOpen = false">Cancel</button>
            </div>
        </template>
    </BDialog>
</template>

<script setup lang="ts">
import {type ServerResource} from '@/api/requests/servers/ServerIndexRequest.ts'
import ServerItemState from '@/pages/ServerPage/components/ServerItemState.vue'
import ServerItemQueueCount from '@/pages/ServerPage/components/ServerItemQueueCount.vue'
import {useRouter} from 'vue-router'
import useDateHandling from '@/composables/useDateHandling.ts'
import {ServerDeleteRequest} from '@/api/requests/servers/ServerDeleteRequest'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import BDialog from '@/ui/BDialog.vue'
import {ExclamationTriangleIcon} from '@heroicons/vue/24/outline'
import {useIsOpen} from '@hank-it/ui/vue'

const props = defineProps({
    server: Object as ServerResource,
})

const emits = defineEmits(['server-deleted'])

const router = useRouter()

const {fromISOToRelativeString, fromISOToLocalDateTimeString} = useDateHandling()

const serverDeleteRequest = new ServerDeleteRequest(props.server.id)

const {isOpen} = useIsOpen()

function deleteServer() {
    isOpen.value = false

    serverDeleteRequest
        .send()
        .then(response => {
            emits('server-deleted')
        })
        .catch(exception => {
            //
        })
}
</script>