<template>
    <BSlideover v-model="isOpen">
        <template #title>
            LDAP query
        </template>

        <template #default>
            <form @submit.prevent="submit" id="recipient-ldap-query-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <template v-if="sent">
                        The request has been queued. You may view the progress in the task viewer.

                        <button type="button"
                                class="inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            Open task viewer
                        </button>

                    </template>
                    <template v-else-if="genericError">
                        The request failed.
                    </template>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Cancel</button>
                <button form="recipient-ldap-query-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Query</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper} from '@hank-it/ui/vue'
import { ref} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import { RecipientLdapQueryRequest } from '@/api/requests/recipients/RecipientLdapQueryRequest'

const props = defineProps({
    modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue'])

const isOpen = useModelWrapper(props, emits)

const request = new RecipientLdapQueryRequest()

const sent = ref(false)
const genericError = ref(false)

function submit() {
    request
        .send()
        .then(() => {
            sent.value = true
        })
        .catch(() => {
            genericError.value = true
        })
}
</script>