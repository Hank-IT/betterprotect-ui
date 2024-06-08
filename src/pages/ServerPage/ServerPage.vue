<template>
    <div v-if="serverIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div v-else>
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Servers</h2>
            </div>
            <div class="mt-4 flex md:ml-4 md:mt-0">
                <button @click="router.push({ name: 'server.create' })"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >Create
                </button>
            </div>
        </div>

        <div class="mt-5 space-y-5">
            <ServerItem
                v-for="server in servers"
                :key="server.id"
                :server="server"
                @server-deleted="loadServers"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {ServerIndexRequest, ServerIndexResponse} from '@/api/requests/servers/ServerIndexRequest.ts'
import {useRouter} from 'vue-router'
import {ref} from 'vue'
import ServerItem from '@/pages/ServerPage/components/ServerItem.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'

const router = useRouter()

const servers = ref([])

const serverIndexRequest = new ServerIndexRequest()

function loadServers() {
    serverIndexRequest.send()
        .then((result: ServerIndexResponse) => {
            servers.value = result.getData()
        })
        .catch(error => {
            //
        })
}

loadServers()
</script>