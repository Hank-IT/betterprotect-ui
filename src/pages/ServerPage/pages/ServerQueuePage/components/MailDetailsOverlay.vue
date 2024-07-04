<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Mail {{ payload.queue_id }}
        </template>

        <template #default>
            <div class="py-4">
                <div class="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
                    <dl class="space-y-8 px-4 sm:space-y-6 sm:px-6">
                        <div>
                            <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Received</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ fromISOToRelativeString(payload.arrival_time) }}, {{ fromISOToLocalDateTimeString(payload.arrival_time) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Queue</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                                <p>{{ payload.queue_name }}</p>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Sender</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ payload.sender }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Size</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ payload.message_size }}</dd>
                        </div>

                        <div>
                            <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Recipients</dt>
                            <template v-for="recipient in payload.recipients" >
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ recipient.address }}</dd>
                                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">{{ recipient.delay_reason }}</dd>
                            </template>

                        </div>
                    </dl>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Close</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper} from '@hank-it/ui/vue'
import useDateHandling from '@/composables/useDateHandling'

const props = defineProps({
    payload: {
        required: true,
    },
})

const {fromISOToLocalDateTimeString, fromISOToRelativeString} = useDateHandling()

const emits = defineEmits(['update:modelValue'])

const isOpen = useModelWrapper(props, emits)
</script>