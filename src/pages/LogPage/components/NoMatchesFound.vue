<template>
    <div class="text-center mt-4">
        <div v-if="data.meta?.total > 1" class="rounded-md bg-yellow-50 p-4">
            <div>
                <div>
                    <div class="text-sm text-yellow-700">
                        <p>
                            <template v-if="data.meta?.relation === 'gte'">
                                We found more than {{ data.meta.total }} matches for your query in the raw index. The result you are looking for might be unparsable.
                                <RouterLink :to="{ name: 'logging.raw', query: { search: search, start_date: startDate, end_date: endDate } }">You may view the raw non-aggregated mail log here.</RouterLink>
                            </template>
                            <template v-else>
                                We found {{ data.meta?.total }} matches for your query in the raw index. The result you are looking for might be unparsable.
                                <RouterLink :to="{ name: 'logging.raw', query: { search: search, start_date: startDate, end_date: endDate } }">You may view the raw non-aggregated mail log here.</RouterLink>
                            </template>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <h3 class="mt-2 text-sm font-semibold text-gray-900">No matches</h3>
        <p class="mt-1 text-sm text-gray-500">
            <template v-if="search === ''">
                No matches found from {{ startDate }} to {{ endDate }}
            </template>
            <template v-else>
                No matches found for {{ search }} from {{ startDate }} to {{ endDate }}
            </template>
        </p>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {RawLogRequest} from '@/api/requests/logging/RawLogRequest'

const props = defineProps({
    search: String,
    startDate: String,
    endDate: String,
})

const aggregatedLogDetailsRequest = new RawLogRequest().withParams({
    start_date: props.startDate,
    end_date: props.endDate,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    search: props.search,
    page_number: 1,
    page_size: 1,
})

const data = ref({})

function load() {
    aggregatedLogDetailsRequest
        .send()
        .then(response => {
            data.value = response.getBody()
        })
        .catch(exception => {
            //
        })
}

load()
</script>

<style scoped>

</style>