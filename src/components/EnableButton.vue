<template>
    <button @click="send" type="button" class="relative rounded bg-primary-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Enable
    </button>
</template>

<script setup lang="ts">
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {ActivationContent, ActivationRequest} from '@/api/requests/activation/ActivationRequest'

const props = defineProps({
    entity: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    }
})

const emits = defineEmits(['success'])

const request = new ActivationRequest(props.entity, props.id)

function send() {
    request.setBody(new ActivationContent({
        state: true,
    })).send().then(() => {
        emits('success')
    }).catch(exception => {
        //
    })
}
</script>