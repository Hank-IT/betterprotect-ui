<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Configure search fields

            <div class="mt-1">
                <p class="text-sm text-primary-300">Changes are applied instantly without saving.</p>
            </div>
        </template>

        <template #default>
            <div class="px-6 py-4">
                <fieldset class="border-b border-gray-200">
                    <legend class="sr-only">Notifications</legend>
                    <div class="divide-y divide-gray-200">
                        <div v-for="field in fields" class="relative flex items-start pb-4 pt-3.5">
                            <div class="min-w-0 flex-1 text-sm leading-6">
                                <label :for="field.field" class="font-medium text-gray-900">{{ field.field }}</label>
                                <p :id="`${field.field}-description`" class="text-gray-500">{{ field.description }}</p>
                            </div>
                            <div class="ml-3 flex h-6 items-center">
                                <input
                                    v-model="internalSelectedFields"
                                    :key="field.field"
                                    :id="field.field"
                                    :aria-describedby="`${field.field}-description`"
                                    :value="field.value"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
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
import {useModelWrapper} from '@hank-it/ui/vue'
import {computed, ref} from 'vue'

const props = defineProps({
    modelValue: Boolean,
    selectedFields: Array,
})

const form = ref({
    domain: '',
})

const emits = defineEmits(['update:modelValue', 'update:selected-fields', 'success'])

const isOpen = useModelWrapper(props, emits)

const internalSelectedFields = computed({
    get() {
        return props.selectedFields
    },
    set(value) {
        emits('update:selected-fields', value)
    }
})

const fields = [
    {
        field: 'Queue ID',
        value: 'postfix_queueid',
        description: 'The queue id of the mail assigned by postfix.'
    },
    {
        field: 'Client hostname',
        value: 'postfix_client_hostname',
        description: 'The hostname of the client resolved by postfix.'
    },
    {
        field: 'Client IP',
        value: 'postfix_client_ip',
        description: 'The ip address of the client.'
    },
    {
        field: 'Relay IP',
        value: 'postfix_relay_ip',
        description: 'The hostname of the host postfix relays the mail to.'
    },
    {
        field: 'Relay hostname',
        value: 'postfix_relay_hostname',
        description: 'The ip address of the host postfix relays the mail to.'
    },
    {
        field: 'From address',
        value: 'postfix_from',
        description: 'The from address of the email.'
    },
    {
        field: 'To address',
        value: 'postfix_to',
        description: 'The to address of the email.'
    },
    {
        field: 'Status',
        value: 'postfix_status',
        description: 'The status a deliver attempt: Sent, Reject, Bounced, Deferred, Blocked'
    },
    {
        field: 'Headers',
        value: 'postfix_headers',
        description: 'The headers of the email as logged by postfix.'
    },
]
</script>