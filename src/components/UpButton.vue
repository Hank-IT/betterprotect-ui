<template>
    <button @click="send" type="button" class="relative rounded bg-white-600 px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Up
    </button>
</template>

<script setup lang="ts">
import {ItemOrderRequest} from '@/api/requests/order/ItemOrderRequest.ts'
import ProgressLoader from '@/ui/ProgressLoader.vue'

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

const request = new ItemOrderRequest(props.entity, props.id, 'up')

function send() {
    request.send().then(() => {
        emits('success')
    }).catch(exception => {
        //
    })
}
</script>