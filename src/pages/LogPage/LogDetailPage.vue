<template>
    <pre>
        {{ details }}
    </pre>
</template>

<script setup lang="ts">
import {PostfixLogDetailsRequest} from '@/api/requests/logging/PostfixLogDetailRequest'
import {ref} from 'vue'

const props = defineProps({
    id: String,
})

const logDetailRequest = new PostfixLogDetailsRequest(props.id)

const details = ref()

function load() {
    logDetailRequest
        .send()
        .then(response => {
            details.value = response.getData()
        })
        .catch(exception => {
            //
        })
}

load()
</script>