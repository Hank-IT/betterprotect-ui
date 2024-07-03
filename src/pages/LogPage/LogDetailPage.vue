<template>
    <pre>
        {{ details }}
    </pre>
</template>

<script setup lang="ts">
import {AggregatedLogDetailsRequest} from '@/api/requests/logging/AggregatedLogDetailsRequest'
import {ref} from 'vue'
import {debounce} from 'lodash'

const props = defineProps({
    id: String,
})

const aggregatedLogDetailsRequest = new AggregatedLogDetailsRequest(props.id)

const details = ref()

function load() {
    aggregatedLogDetailsRequest
        .send()
        .then(response => {
            details.value = response.getData()
        })
        .catch(exception => {
            //
        })
}


const loadDebounced = debounce(() => {
    load(1)
}, 250)

loadDebounced()
</script>