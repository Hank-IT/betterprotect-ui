<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Create milter exception
        </template>

        <template #default>
            <form @submit.prevent="submit" id="create-milter-exception-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <div>
                            <label for="client_type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
                            <select ref="clientTypeRef" v-model="form.client_type" id="client_type" name="client_type" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="">Please select</option>
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

                        <BInput v-model="form" :errors="formErrors" id="client_payload" name="client_payload">
                            <template #label>
                                Client
                            </template>
                        </BInput>

                        <div>
                            <label for="milter_id" class="block text-sm font-medium leading-6 text-gray-900">Milter</label>
                            <select multiple v-model="form.milter_id" id="milter_id" name="milter_id" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option v-for="milter in milters" :value="milter.id" :key="milter.id">{{ milter.name }}</option>
                            </select>

                            <p class="mt-2 text-sm text-red-600" id="client_type-error">
                                <template v-for="error in formErrors.milter_id">
                                    {{ error }}
                                </template>
                            </p>
                        </div>

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
                <button form="create-milter-exception-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper, useOnOpen } from '@hank-it/ui/vue'
import { ref} from 'vue'
import BInput from '@/ui/BInput.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import BTextarea from '@/ui/BTextarea.vue'
import { MilterIndexRequest, MilterIndexResponse } from '@/api/requests/milters/MilterIndexRequest'
import { MilterExceptionCreateContent, MilterExceptionCreateRequest } from '@/api/requests/milters/MilterExceptionCreateRequest'

const props = defineProps({
    modelValue: Boolean,
})

const form = ref({
    client_type: '',
    client_payload: '',
    milter_id: [],
    description: '',
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const formErrors = ref({})

const request = new MilterExceptionCreateRequest()

const milterIndexRequest = new MilterIndexRequest()

const milters = ref({})
const clientTypeRef = ref(null)

function loadMilters() {
    return milterIndexRequest.send()
            .then((result: MilterIndexResponse) => {
                milters.value = result.getData()
            })
            .catch(error => {
                //
            })
}

const {onOpen} = useOnOpen(props)

onOpen(() => {
    loadMilters()

    clientTypeRef.value.focus()
})

function submit() {
    request
        .setBody(new MilterExceptionCreateContent(form.value))
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