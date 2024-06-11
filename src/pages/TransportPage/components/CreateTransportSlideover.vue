<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Create transport
        </template>

        <template #default>
            <form @submit.prevent="submit" id="create-transport-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <BInput v-model="form" :errors="formErrors" id="domain" name="domain" class="sm:col-span-6">
                            <template #label>
                                Domain
                            </template>
                        </BInput>

                        <BInput v-model="form" :errors="formErrors" id="transport" name="transport" class="sm:col-span-6">
                            <template #label>
                                Transport
                            </template>
                        </BInput>

                        <div>
                            <label for="nexthop_type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <select v-model="form.nexthop_type" id="nexthop_type" name="nexthop_type" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="">None</option>
                                <option value="ipv4">IPv4</option>
                                <option value="ipv6">IPv6</option>
                                <option value="hostname">Hostname</option>
                            </select>

                            <p class="mt-2 text-sm text-red-600" id="sender_type-error">
                                <template v-for="error in formErrors.nexthop_type">
                                    {{ error }}
                                </template>
                            </p>
                        </div>

                        <template v-if="form.nexthop_type !== ''">
                            <BInput v-model="form" :errors="formErrors" id="nexthop" name="nexthop" class="sm:col-span-6">
                                <template #label>
                                    Nexthop
                                </template>
                            </BInput>

                            <BInput v-model="form" :errors="formErrors" id="nexthop_port" name="nexthop_port" class="sm:col-span-6" type="number">
                                <template #label>
                                    Nexthop Port
                                </template>
                            </BInput>

                            <SwitchGroup v-if="form.nexthop_type === 'hostname'" as="div" class="flex items-center">
                                <Switch v-model="form.nexthop_mx" :class="[form.nexthop_mx ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2']">
                                    <span aria-hidden="true" :class="[form.nexthop_mx ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                                </Switch>
                                <SwitchLabel as="span" class="ml-3 text-sm">
                                    <span class="font-medium text-gray-900">Nexthop MX lookup</span>
                                    {{ ' ' }}
                                </SwitchLabel>
                            </SwitchGroup>
                        </template>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Cancel</button>
                <button form="create-transport-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper} from '@hank-it/ui/vue'
import { ref} from 'vue'
import BInput from '@/ui/BInput.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {TransportCreateContent, TransportCreatRequest} from '@/api/requests/transports/TransportCreateRequest'
import {Switch, SwitchGroup, SwitchLabel} from '@headlessui/vue'

const props = defineProps({
    modelValue: Boolean,
})

const form = ref({
    domain: '',
    transport: 'smtp',
    nexthop_type: 'ipv4',
    nexthop: '',
    nexthop_port: 25,
    nexthop_mx: false,
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const formErrors = ref({})
const genericError = ref(false)

const request = new TransportCreatRequest

function submit() {
    request
        .setBody(new TransportCreateContent(form.value))
        .send()
        .then(response => {
            emits('success')

            isOpen.value = false
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
</script>