<template>
    <div v-if="transportIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Transports</h1>
                <p class="mt-2 text-sm text-gray-700">Transports define how Postfix relays mail traffic.</p>
            </div>
        </div>

        <div class="sm:flex sm:items-center mt-6">
            <div class="sm:flex-auto">
                <input
                    ref="searchRef"
                    v-model="search"
                    name="search"
                    type="text"
                    placeholder="Search"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button @click="createTransportSlideoverOpen = true"
                        v-if="auth.check(['editor', 'administrator'])"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create transport
                </button>
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
                                    Domain
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Transport
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Nexthop
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Nexthop Port
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Nexthop MX
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Source
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="transport in paginator.getPageData()" :key="transport.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <div v-if="! transport.active" class="absolute inset-y-0 left-0 w-0.5 bg-yellow-400"></div>

                                    <span class="text-gray-700">{{ transport.domain }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ transport.transport }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ transport.nexthop }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ transport.nexthop_port }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ transport.nexthop_mx }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ transport.data_source }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <DisableButton v-if="transport.active && auth.check(['editor', 'administrator'])" entity="transport" :id="transport.id" @success="loadTransports" />
                                    <EnableButton v-if="! transport.active &&auth.check(['editor', 'administrator'])" entity="transport" :id="transport.id" @success="loadTransports" />
                                    <DeleteTransportButton v-if="auth.check(['editor', 'administrator'])" :id="transport.id" @success="loadTransports" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <BPagination
                        v-model="pageNumber"
                        v-model:page-size="pageSize"
                        @refresh="loadTransports"
                        :page-count="paginator.getLastPage()"
                        :from-count="paginator.getFromItemNumber()"
                        :to-count="paginator.getToItemNumber()"
                        :total-count="paginator.getTotal()"
                    />
                </div>
            </div>
        </div>

        <div v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No transports</h3>
            <p class="mt-1 text-sm text-gray-500">
                <template v-if="search === ''">
                    Get started by creating a transport.
                </template>
                <template v-else>
                    No matches found for {{ search }}
                </template>
            </p>
        </div>
    </div>

    <CreateTransportSlideover v-model="createTransportSlideoverOpen" @success="loadTransports" :key="createTransportSlideoverKey" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import DisableButton from '@/components/DisableButton.vue'
import EnableButton from '@/components/EnableButton.vue'
import {debounce} from 'lodash'
import BPagination from '@/ui/BPagination.vue'
import {TransportIndexRequest} from '@/api/requests/transports/TransportIndexRequest'
import CreateTransportSlideover from '@/pages/TransportPage/components/CreateTransportSlideover.vue'
import DeleteTransportButton from '@/pages/TransportPage/components/DeleteTransportButton.vue'
import { useAuthStore } from '@/stores/auth'

const internalSearch = ref('')

const auth = useAuthStore()

const transportIndexRequest = new TransportIndexRequest

const search = computed({
    set(value) {
        internalSearch.value = value

        transportIndexRequest.withParams({
            search: value
        })

        loadTransportsDebounced(1)
    },
    get() {
        return internalSearch.value
    }
})

const pageNumber = computed({
    set(value) {
        paginator.setPage(value)
    },
    get() {
        return paginator.getCurrentPage()
    }
})

const pageSize = computed({
    set(value) {
        paginator.setPageSize(value)
    },
    get() {
        return paginator.getPageSize()
    }
})

const {isOpen: createTransportSlideoverOpen, isOpenKey: createTransportSlideoverKey} = useIsOpen()

const initialLoading = ref(false)
const searchRef = ref(null)

const paginator = new Paginator(new RequestDriver(transportIndexRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(() => {
    initialLoading.value = true
})

function loadTransports(page: Number = undefined) {
    page ? paginator.refresh(page): paginator.refresh()
}

const loadTransportsDebounced = debounce(() => {
    loadTransports(1)
}, 250)

onMounted(() => {
    searchRef.value.focus()
})
</script>