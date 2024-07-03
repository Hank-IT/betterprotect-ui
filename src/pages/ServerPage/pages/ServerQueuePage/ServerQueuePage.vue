<template>
    <div>
        <div v-if="serverQueueIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
            <ProgressLoader/>
        </div>

        <div>
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Postfix Queue</h1>
                    <p class="mt-2 text-sm text-gray-700">This is a cached view of the postfix mail queue. The cache is updated once a minute.</p>
                </div>

                <div class="sm:flex sm:items-center mt-6">
                    <div class="sm:flex-auto"></div>
                    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            v-if="auth.check(['editor', 'administrator'])"
                            type="button"
                            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Flush queue
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="Object.keys(paginator.getPageData()).length > 0" class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div class="relative">
                            <table class="min-w-full table-fixed divide-y divide-gray-300">
                                <thead>
                                <tr>
                                    <th scope="col"
                                        class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 relative px-3 sm:w-12">
                                        Received
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Sender
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Queue
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Recipients
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="mail in paginator.getPageData()" :key="mail.queue_id">
                                    <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="font-medium text-gray-900">{{ fromISOToRelativeString(mail.arrival_time) }}</div>
                                                <div class="mt-1 text-gray-500">{{ fromISOToLocalDateTimeString(mail.arrival_time) }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div class="flex items-center">
                                            <div class="ml-4">
                                                <div class="font-medium text-gray-900 truncate">{{ mail.sender }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div class="flex items-center">
                                            <div class="ml-4">
                                                <div>
                                                    <div class="font-medium text-gray-900">{{ mail.queue_name }}</div>
                                                    <div class="mt-1 text-gray-500">{{ mail.queue_id }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div class="flex items-center">
                                            <div class="ml-4">
                                                <div class="font-medium text-gray-900">{{ mail.recipients[0]?.address }}</div>
                                                <div v-if="mail.recipients.length > 1" class="mt-1 text-gray-500">{{ mail.recipients.length - 1 }} recipients</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                        Details
                                        <DeleteMailButton :server-id="id" :queue-id="mail.queue_id" @success="load" />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <BPagination
                            v-model="pageNumber"
                            :page-count="paginator.getLastPage()"
                            :from-count="paginator.getFromItemNumber()"
                            :to-count="paginator.getToItemNumber()"
                            :total-count="paginator.getTotal()"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useRouter} from 'vue-router'
import {computed, ref} from 'vue'
import {ServerQueueIndexRequest} from '@/api/requests/queue/ServerQueueIndexRequest'
import BPagination from '@/ui/BPagination.vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import {useAuthStore} from '@/stores/auth'
import useDateHandling from '@/composables/useDateHandling'
import DeleteMailButton from '@/pages/ServerPage/pages/ServerQueuePage/components/DeleteMailButton.vue'

const props = defineProps({
    id: {
        required: true,
    },
})

const {fromISOToLocalDateTimeString, fromISOToRelativeString} = useDateHandling()

const router = useRouter()

const auth = useAuthStore()

const pageNumber = computed({
    set(value) {
        paginator.setPage(value)
    },
    get() {
        return paginator.getCurrentPage()
    }
})

const initialLoading = ref(false)

const serverQueueIndexRequest = new ServerQueueIndexRequest(props.id)

const paginator = new Paginator(new RequestDriver(serverQueueIndexRequest))

paginator.init(1, 10).then(() => {
    initialLoading.value = true
})

function load(page: Number = undefined) {
    page ? paginator.refresh(page): paginator.refresh()
}
</script>