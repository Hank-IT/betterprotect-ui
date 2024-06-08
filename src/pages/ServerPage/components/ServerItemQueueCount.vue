<template>
    <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Queue</dt>
        <dd class="text-gray-700">
            <template v-if="request.isLoading()">
                <span class="text-gray-700 italic">Checking server queue state...</span>
            </template>
            <template v-else>
                <template v-if="count === 1">
                    1 item
                </template>
                <template v-else-if="count > 0">
                    {{ count }} items
                </template>
                <template v-else>
                    <span class="text-gray-700 italic">Unknown count</span>
                </template>
            </template>
        </dd>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type {ServerResource} from '@/api/requests/servers/ServerIndexRequest'
import {ServerQueueCountRequest} from '@/api/requests/servers/ServerQueueCountRequest'

const props = defineProps({
    server: Object as ServerResource,
})

const request = new ServerQueueCountRequest(props.server.id)

const count = ref()

request
    .send()
    .then(response => {
        count.value = response.getData().count
    })
</script>