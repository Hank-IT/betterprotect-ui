<template>
    <button @click="flushQueue" type="button" class="relative rounded-md bg-primary-600 px-3 py-2  text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Refresh cache
    </button>
</template>

<script setup lang="ts">
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {ServerQueueRefreshRequest} from '@/api/requests/queue/ServerQueueRefreshRequest'

const props = defineProps({
    id: {
        required: true,
    }
})

const emits = defineEmits(['success'])

const request = new ServerQueueRefreshRequest(props.id)

function flushQueue() {
    request.send().then(() => {
        emits('success')
    }).catch(exception => {
        //
    })
}
</script>