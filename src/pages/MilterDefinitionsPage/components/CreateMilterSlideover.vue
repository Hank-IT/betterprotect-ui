<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Create milter definition
        </template>

        <template #default>
            <form @submit.prevent="submit" id="create-milter-definition-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <BInput ref="nameRef" v-model="form" :errors="formErrors" id="name" name="name">
                            <template #label>
                                Name
                            </template>
                        </BInput>

                        <BInput v-model="form" :errors="formErrors" id="definition" name="definition">
                            <template #label>
                                Definition
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
                <button form="create-milter-definition-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper, useOnOpen} from '@hank-it/ui/vue'
import { ref} from 'vue'
import BInput from '@/ui/BInput.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import { MilterCreateContent, MilterCreateRequest } from '@/api/requests/milters/MilterCreateRequest'
import BTextarea from '@/ui/BTextarea.vue'

const props = defineProps({
    modelValue: Boolean,
})

const form = ref({
    name: '',
    definition: '',
    description: '',
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const formErrors = ref({})
const nameRef = ref(null)

const request = new MilterCreateRequest()

const {onOpen} = useOnOpen(props)

onOpen(() => {
    nameRef.value.focus()
})

function submit() {
    request
        .setBody(new MilterCreateContent(form.value))
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