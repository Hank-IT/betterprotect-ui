<template>
    <button @click="isOpen = true" type="button" class="relative rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Delete
    </button>

    <ConfirmationDialog v-model="isOpen" @action="deleteTransport">
        <template #title>
            Delete mail
        </template>

        <template #description>
            Are you sure you want to delete this mail from the queue?. This action cannot be undone.
        </template>

        <template #action>
            Delete
        </template>
    </ConfirmationDialog>
</template>

<script setup lang="ts">
import ProgressLoader from '@/ui/ProgressLoader.vue'
import ConfirmationDialog from '@/ui/ConfirmationDialog.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import {ServerQueueMailDeleteContent, ServerQueueMailDeleteRequest} from '@/api/requests/queue/ServerQueueMailDeleteRequest'

const props = defineProps({
    serverId: {
        required: true,
    },
    queueId: {
        required: true,
    }
})

const emits = defineEmits(['success'])

const request = new ServerQueueMailDeleteRequest(props.serverId)

const {isOpen} = useIsOpen()

function deleteTransport() {
    request.setBody(new ServerQueueMailDeleteContent({
        queue_id: props.queueId
    })).send().then(() => {
        emits('success')

        isOpen.value = false
    }).catch(exception => {
        //
    })
}
</script>