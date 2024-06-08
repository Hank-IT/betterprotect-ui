<template>
    <div v-if="request.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader />
    </div>

    <div v-if="genericError" class="rounded-md bg-red-50 p-4 mb-10">
        <div class="flex">
            <div class="flex-shrink-0">
                <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">There was an error submitting the form.</h3>
            </div>
        </div>
    </div>

    <ServerForm
        @submit="submit"
        :url="request.url()"
        :method="request.method()"
        v-model="form"
        :form-errors="formErrors"
    />
</template>

<script setup>
import {ref} from 'vue'
import {ServerCreateRequest, ServerCreateContent} from '@/api/requests/servers/ServerCreateRequest.ts'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import {useRouter} from 'vue-router'
import ServerForm from '@/pages/ServerPage/components/ServerForm.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'

const router = useRouter()

const form = ref({
    hostname: '',
    postfix_db_host: '',
    postfix_db_name: '',
    postfix_db_user: '',
    postfix_db_password: '',
    postfix_db_port: '',
    ssh_user: '',
    ssh_public_key: '',
    ssh_private_key: '',
    ssh_command_sudo: '',
    ssh_command_postqueue: '',
    ssh_command_postsuper: '',
    log_db_host: '',
    log_db_name: '',
    log_db_user: '',
    log_db_password: '',
    log_db_port: '',
})

const formErrors = ref({})
const genericError = ref(false)

const request = new ServerCreateRequest()

function submit() {
    request
        .setBody(new ServerCreateContent(form.value))
        .send()
        .then(response => {
            router.push({ name: 'server.index' })
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