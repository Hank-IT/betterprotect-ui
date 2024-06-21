<template>
    <div v-if="serverShowRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader />
    </div>

    <div v-else>
        <div v-if="serverUpdateRequest.isLoading()" class="absolute w-full top-16 left-0">
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
            :url="serverUpdateRequest.url()"
            :method="serverUpdateRequest.method()"
            v-model="form"
            :form-errors="formErrors"
            mode="update"
        />
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {ServerUpdateRequest, ServerUpdateContent} from '@/api/requests/servers/ServerUpdateRequest.ts'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import {useRouter} from 'vue-router'
import ServerForm from '@/pages/ServerPage/components/ServerForm.vue'
import {ServerShowRequest} from '@/api/requests/servers/ServerShowRequest.ts'
import ProgressLoader from '@/ui/ProgressLoader.vue'

const props = defineProps({
    id: {
        required: true,
    },
})

const router = useRouter()

const form = ref({})

const formErrors = ref({})
const genericError = ref(false)

const serverShowRequest = new ServerShowRequest(props.id)

serverShowRequest.send()
    .then(response => {
        form.value = response.getData()
    })
    .catch(exception => {

    })

const serverUpdateRequest = new ServerUpdateRequest(props.id)

function submit() {
    serverUpdateRequest
        .setBody(new ServerUpdateContent(form.value))
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