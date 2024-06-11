<template>
    <div v-if="relayDomainIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Relay domains</h1>
                <p class="mt-2 text-sm text-gray-700">Relay domains define which domains Postfix accepts mails for.</p>
            </div>
        </div>

        <div class="sm:flex sm:items-center mt-6">
            <div class="sm:flex-auto">
                <input
                    v-model="search"
                    name="search"
                    type="text"
                    placeholder="Search"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button @click="createRelayDomainSlideoverOpen = true"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create relay domain
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
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="relayDomain in paginator.getPageData()" :key="relayDomain.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <div v-if="! relayDomain.active" class="absolute inset-y-0 left-0 w-0.5 bg-yellow-400"></div>

                                    <span class="text-gray-700">{{ relayDomain.domain }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <DisableButton v-if="relayDomain.active" entity="relay-domain" :id="relayDomain.id" @success="loadRelayDomains" />
                                    <EnableButton v-if="! relayDomain.active" entity="relay-domain" :id="relayDomain.id" @success="loadRelayDomains" />
                                    <DeleteRelayDomainButton :id="relayDomain.id" @success="loadRelayDomains" />
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

        <div v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No relay domains</h3>
            <p class="mt-1 text-sm text-gray-500">
                <template v-if="search === ''">
                    Get started by creating a relay domain.
                </template>
                <template v-else>
                    No matches found for {{ search }}
                </template>
            </p>
        </div>
    </div>

    <CreateRelayDomainSlideover v-model="createRelayDomainSlideoverOpen" @success="loadRelayDomains" :key="createRelayDomainSlideoverKey" />
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import DisableButton from '@/components/DisableButton.vue'
import EnableButton from '@/components/EnableButton.vue'
import {debounce} from 'lodash'
import BPagination from '@/ui/BPagination.vue'
import {RelayDomainIndexRequest} from '@/api/requests/relayDomains/RelayDomainIndexRequest'
import DeleteRelayDomainButton from '@/pages/RelayDomains/components/DeleteRelayDomainButton.vue'
import CreateRelayDomainSlideover from '@/pages/RelayDomains/components/CreateRelayDomainSlideover.vue'

const internalSearch = ref('')

const relayDomainIndexRequest = new RelayDomainIndexRequest

const search = computed({
    set(value) {
        internalSearch.value = value

        relayDomainIndexRequest.withParams({
            search: value
        })

        loadRelayDomainsDebounced(1)
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

const {isOpen: createRelayDomainSlideoverOpen, isOpenKey: createRelayDomainSlideoverKey} = useIsOpen()

const initialLoading = ref(false)

const paginator = new Paginator(new RequestDriver(relayDomainIndexRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(() => {
    initialLoading.value = true
})

function loadRelayDomains(page: Number = undefined) {
    page ? paginator.refresh(page): paginator.refresh()
}

const loadRelayDomainsDebounced = debounce(() => {
    loadRelayDomains(1)
}, 250)
</script>