
<template>
    <BSlideover v-model="isOpen">
        <template #title>
            Update user password
        </template>

        <template #default>
            <form @submit.prevent="submit" id="update-user-password-form" class="flex flex-1 flex-col justify-between" :action="request.url()" :method="request.method()">
                <div class="relative divide-y divide-gray-200 px-4 sm:px-6">
                    <div v-if="request.isLoading()" class="absolute w-full top-0 right-0">
                        <ProgressLoader/>
                    </div>

                    <div class="space-y-4 pb-5 pt-6">
                        <BInput ref="passwordRef" v-model="form" type="password" :errors="formErrors" id="password" name="password">
                            <template #label>
                                Password
                            </template>
                        </BInput>

                        <BInput v-model="form" type="password" :errors="formErrors" id="password_confirmation" name="password_confirmation">
                            <template #label>
                                Password confirmation
                            </template>
                        </BInput>

                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="flex flex-shrink-0 justify-end px-4 py-4">
                <button type="button" class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" @click="isOpen = false">Cancel</button>
                <button form="update-user-password-form" type="submit" class="ml-4 inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Save</button>
            </div>
        </template>
    </BSlideover>
</template>

<script setup lang="ts">
import BSlideover from '@/ui/BSlideover.vue'
import {useModelWrapper, useOnOpen} from '@hank-it/ui/vue'
import { ref} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import BInput from '@/ui/BInput.vue'
import { UserPasswordUpdateRequest, UserRolePasswordPayload } from '@/api/requests/user/UserPasswordUpdateRequest'

const props = defineProps({
    modelValue: Boolean,
    id: Number,
})

const form = ref({
    role: '',
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)

const formErrors = ref({})
const passwordRef = ref(null)

const {onOpen} = useOnOpen(props)

onOpen(() => {
    passwordRef.value.focus()
})

const request = new UserPasswordUpdateRequest

function submit() {
    request.setId(props.id)
        .setBody(new UserRolePasswordPayload(form.value))
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