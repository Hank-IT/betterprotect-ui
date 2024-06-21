<template>
    <BSlideover v-model="isOpen" :initial-focus-ref="serverIdRef">
        <template #title>
            Install policy
        </template>

        <template #default>
            <form @submit.prevent="submit" id="install-policy-form" class="flex flex-1 flex-col justify-between" :action="serverPolicyInstallationRequest.url()" :method="serverPolicyInstallationRequest.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="serverPolicyInstallationRequest.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <div>
                            <template v-if="sent">
                                <p class="text-sm text-gray-700">The request has been queued. You may view the progress in the task viewer.</p>
                            </template>
                            <template v-else-if="genericError">
                                <p class="text-sm text-red-700">The request failed.</p>
                            </template>
                            <template v-else>
                                <div>
                                    <label for="server_id" class="block text-sm font-medium leading-6 text-gray-900">Servers</label>
                                    <select ref="serverIdRef" multiple v-model="form.server_id" id="server_id" name="server_id" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                        <option v-for="server in servers" :value="server.id" :key="server.id">{{ server.hostname }}</option>
                                    </select>

                                    <p class="mt-2 text-sm text-red-600" id="server_id-error">
                                        <template v-for="error in formErrors.server_id">
                                            {{ error }}
                                        </template>
                                    </p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Close</button>

                <button v-if="sent" @click="openTaskViewer" type="button"
                        class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                    Open task viewer
                </button>

                <button v-else form="install-policy-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Install</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper} from '@hank-it/ui/vue'
import { ref } from 'vue'
import { ServerIndexRequest, ServerIndexResponse } from '@/api/requests/servers/ServerIndexRequest'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {
    ServerPolicyInstallationContent,
    ServerPolicyInstallationRequest
} from '@/api/requests/servers/ServerPolicyInstallationRequest'
import { useTaskStore } from '@/stores/task'
import {useOnOpen} from '@hank-it/ui/vue'

const props = defineProps({
    modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const form = ref({
    server_id: []
})

const {onOpen} = useOnOpen(props)

const serverIdRef = ref(null)

const servers = ref([])

const serverPolicyInstallationRequest = new ServerPolicyInstallationRequest

const sent = ref(false)
const genericError = ref(false)
const formErrors = ref({})

const serverIndexRequest = new ServerIndexRequest()

function submit() {
    serverPolicyInstallationRequest
            .setBody(new ServerPolicyInstallationContent(form.value))
            .send()
            .then(response => {
                sent.value = true
            })
            .catch(exception => {
                const error = exception.getError()

                if (error.statusCode === 422) {
                    error.getBodyPromise().then(bodyContent => {
                        formErrors.value = bodyContent.errors
                    })

                    return
                }

                genericError.value = true
            })
}

function loadServers() {
    serverIndexRequest.send()
    .then((result: ServerIndexResponse) => {
      servers.value = result.getData()
    })
    .catch(error => {
      //
    })
}
onOpen(() => {
    loadServers()
})

function openTaskViewer() {
    isOpen.value = false

    const task = useTaskStore()

    task.isSlideoverOpen = true
}
</script>