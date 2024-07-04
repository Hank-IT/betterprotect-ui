<template>
    <button @click="isOpen = true" type="button" class="relative rounded bg-primary-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
        Details
    </button>
    
    <MailDetailsOverlay v-model="isOpen" :payload="payload" />
</template>

<script setup lang="ts">
import {useIsOpen} from '@hank-it/ui/vue'
import MailDetailsOverlay from '@/pages/ServerPage/pages/ServerQueuePage/components/MailDetailsOverlay.vue'

const props = defineProps({
    payload: {
        required: true,
    }
})

const emits = defineEmits(['success'])

const {isOpen} = useIsOpen()
</script>