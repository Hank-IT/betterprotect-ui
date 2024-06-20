<template>
    <button @click="isOpen = true" type="button" class="relative rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Delete
    </button>

    <ConfirmationDialog v-model="isOpen" @action="deleteRecipient">
        <template #title>
            Delete user
        </template>

        <template #description>
            Are you sure you want to delete this user?. This action cannot be undone.
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
import { UserDeleteRequest } from '@/api/requests/user/UserDeleteRequest'

const props = defineProps({
    id: {
        type: Number,
        required: true,
    }
})

const emits = defineEmits(['success'])

const request = new UserDeleteRequest(props.id)

const {isOpen} = useIsOpen()

function deleteRecipient() {
    request.send().then(() => {
        emits('success')
    }).catch(exception => {
        //
    })
}
</script>