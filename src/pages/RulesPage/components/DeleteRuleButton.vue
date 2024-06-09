<template>
    <button @click="send" type="button" class="relative rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
        <div v-if="request.isLoading()" class="absolute w-full left-0 top-0">
            <ProgressLoader/>
        </div>

        Delete
    </button>
</template>

<script setup lang="ts">
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {RuleDeleteRequest} from '@/api/requests/rules/RuleDeleteRequest'

const props = defineProps({
    id: {
        type: Number,
        required: true,
    }
})

const emits = defineEmits(['success'])

const request = new RuleDeleteRequest(props.id)

function send() {
    request.send().then(() => {
        emits('success')
    }).catch(exception => {
        //
    })
}
</script>