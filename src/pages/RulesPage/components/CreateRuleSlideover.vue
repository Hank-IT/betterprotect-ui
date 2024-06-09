<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Create rule
        </template>

        <template #default>
            <form @submit.prevent="submit" id="create-rule-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <h2 class="text-base font-semibold leading-7 text-gray-900">Client</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">The client is the remote server wanting to deliver mail to us.</p>

                        <SwitchGroup as="div" class="flex items-center">
                            <Switch v-model="anyClient" :class="[anyClient ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2']">
                                <span aria-hidden="true" :class="[anyClient ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                            </Switch>
                            <SwitchLabel as="span" class="ml-3 text-sm">
                                <span class="font-medium text-gray-900">Any client</span>
                                {{ ' ' }}
                            </SwitchLabel>
                        </SwitchGroup>

                        <div v-if="! anyClient">
                            <label for="client_type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <select v-model="form.client_type" id="client_type" name="client_type" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="">Please select</option>
                                <option value="client_hostname">Hostname</option>
                                <option value="client_reverse_hostname">Reverse hostname</option>
                                <option value="client_ipv4">IPv4</option>
                                <option value="client_ipv6">IPv6</option>
                                <option value="client_ipv4_net">IPv4 network</option>
                            </select>

                            <p class="mt-2 text-sm text-red-600" id="client_type-error">
                                <template v-for="error in formErrors.client_type">
                                    {{ error }}
                                </template>
                            </p>
                        </div>

                        <BInput v-if="! anyClient" v-model="form" :errors="formErrors" id="client_payload" name="client_payload" class="sm:col-span-6">
                            <template #label>
                                Client
                            </template>
                        </BInput>

                        <h2 class="text-base font-semibold leading-7 text-gray-900">Sender</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">The sender is the person wanting to deliver mail to us.</p>

                        <SwitchGroup as="div" class="flex items-center">
                            <Switch v-model="anySender" :class="[anySender ? 'bg-primary-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2']">
                                <span aria-hidden="true" :class="[anySender ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                            </Switch>
                            <SwitchLabel as="span" class="ml-3 text-sm">
                                <span class="font-medium text-gray-900">Any sender</span>
                                {{ ' ' }}
                            </SwitchLabel>
                        </SwitchGroup>

                        <div v-if="! anySender">
                            <label for="sender_type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <select v-model="form.sender_type" id="sender_type" name="sender_type" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="">Please select</option>
                                <option value="mail_from_address">Mail from address</option>
                                <option value="mail_from_domain">Mail from domain</option>
                                <option value="mail_from_localpart">Mail from localpart</option>
                            </select>

                            <p class="mt-2 text-sm text-red-600" id="sender_type-error">
                                <template v-for="error in formErrors.sender_type">
                                    {{ error }}
                                </template>
                            </p>
                        </div>

                        <BInput  v-if="! anySender" v-model="form" :errors="formErrors" id="sender_payload" name="sender_payload" class="sm:col-span-6">
                            <template #label>
                                Sender
                            </template>
                        </BInput>

                        <fieldset>
                            <legend class="text-sm font-semibold leading-6 text-gray-900">Action</legend>
                            <p class="mt-1 text-sm leading-6 text-gray-600">Determine what this rule is supposed to do.</p>
                            <div class="mt-3 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center">
                                        <input v-model="form.action" id="action-ok" name="action" value="ok" type="radio" class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600" />
                                        <label for="action-ok" class="ml-3 block text-sm font-medium leading-6 text-gray-900">Accept</label>
                                    </div>

                                    <div  class="flex items-center">
                                        <input v-model="form.action" id="action-reject" name="action" value="reject" type="radio" class="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600" />
                                        <label for="action-reject" class="ml-3 block text-sm font-medium leading-6 text-gray-900">Reject</label>
                                    </div>
                                </div>
                            </div>

                            <p class="mt-2 text-sm text-red-600" id="action-error">
                                <template v-for="error in formErrors.action">
                                    {{ error }}
                                </template>
                            </p>
                        </fieldset>

                        <h2 class="text-base font-semibold leading-7 text-gray-900">Details</h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">In case of rejection the message is send to the client to inform them about the reason.</p>

                        <BInput  v-model="form" :errors="formErrors" id="message" name="message">
                            <template #label>
                                Message
                            </template>
                        </BInput>

                        <BTextarea v-model="form" :errors="formErrors" id="description" name="description" :rows="2">
                            <template #label>
                                Description
                            </template>
                        </BTextarea>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Cancel</button>
                <button form="create-rule-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper} from '@hank-it/ui/vue'
import {computed, ref} from 'vue'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import {RuleCreateContent, RuleCreateRequest} from '@/api/requests/rules/RuleCreateRequest'
import BInput from '@/ui/BInput.vue'
import BTextarea from '@/ui/BTextarea.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'

const props = defineProps({
    modelValue: Boolean,
})

const form = ref({
    client_type: '',
    client_payload: '',
    sender_type: '',
    sender_payload: '',
    message: '',
    description: '',
    action: '',
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const internalAnyClient = ref(false)
const internalAnySender = ref(false)

const formErrors = ref({})

const anyClient = computed({
    get() {
        return internalAnyClient.value
    },
    set(value) {
        internalAnyClient.value = value

        form.value.client_type = internalAnyClient.value ? '*' : ''
        form.value.client_payload = internalAnyClient.value ? '*' : ''
    }
})

const anySender = computed({
    get() {
        return internalAnySender.value
    },
    set(value) {
        internalAnySender.value = value

        form.value.sender_type = internalAnySender.value ? '*' : ''
        form.value.sender_payload = internalAnySender.value ? '*' : ''
    }
})

const request = new RuleCreateRequest

function submit() {
    request
        .setBody(new RuleCreateContent(form.value))
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