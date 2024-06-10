<template>
    <div v-if="recipientIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Recipients</h1>
                <p class="mt-2 text-sm text-gray-700">Define recipients which Postfix will accept mails for.</p>
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
                <button @click="createRecipientSlideoverOpen = true"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create recipient
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
                                    Recipient
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Source
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="recipient in paginator.getPageData()" :key="recipient.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <div v-if="! recipient.active" class="absolute inset-y-0 left-0 w-0.5 bg-yellow-400"></div>

                                    <span class="text-gray-700">{{ recipient.payload }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ recipient.data_source }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <DisableButton v-if="recipient.active" entity="relay-recipient" :id="recipient.id" @success="loadRecipients" />
                                    <EnableButton v-if="! recipient.active" entity="relay-recipient" :id="recipient.id" @success="loadRecipients" />
                                    <DeleteRecipientButton :id="recipient.id" @success="loadRecipients" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex items-center justify-between border-t border-gray-200 bg-white py-3 px-3">
                        <div class="flex flex-1 justify-between sm:hidden">
                            <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                            <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                        </div>
                        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Showing
                                    {{ ' ' }}
                                    <span class="font-medium">{{ paginator.getFromItemNumber() }}</span>
                                    {{ ' ' }}
                                    to
                                    {{ ' ' }}
                                    <span class="font-medium">{{ paginator.getToItemNumber() }}</span>
                                    {{ ' ' }}
                                    of
                                    {{ ' ' }}
                                    <span class="font-medium">{{ paginator.getTotal() }}</span>
                                    {{ ' ' }}
                                    items.
                                </p>
                            </div>
                            <div>
                                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <a href="#" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        <span class="sr-only">Previous</span>
                                        <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                                    </a>
                                    <!-- Current: "z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
                                    <a href="#" aria-current="page" class="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">1</a>
                                    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
                                    <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
                                    <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                                    <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">8</a>
                                    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">9</a>
                                    <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">10</a>
                                    <a href="#" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                        <span class="sr-only">Next</span>
                                        <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No recipients</h3>
            <p class="mt-1 text-sm text-gray-500">
                <template v-if="search === ''">
                    Get started by creating a recipient.
                </template>
                <template v-else>
                    No matches found for {{ search }}
                </template>
            </p>
        </div>
    </div>

    <CreateRecipientSlideover v-model="createRecipientSlideoverOpen" @success="loadRecipients" :key="createRecipientSlideoverKey" />
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import DisableButton from '@/components/DisableButton.vue'
import EnableButton from '@/components/EnableButton.vue'
import {debounce} from 'lodash'
import {RecipientIndexRequest} from '@/api/requests/recipients/RecipientIndexRequest.ts'
import CreateRecipientSlideover from '@/pages/RecipientsPage/components/CreateRecipientSlideover.vue'
import DeleteRecipientButton from '@/pages/RecipientsPage/components/DeleteRecipientButton.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

const internalSearch = ref('')

const recipientIndexRequest = new RecipientIndexRequest()

const search = computed({
    set(value) {
        internalSearch.value = value

        recipientIndexRequest.withParams({
            search: value
        })

        loadRecipientsDebounced()
    },
    get() {
        return internalSearch.value
    }
})

const {isOpen: createRecipientSlideoverOpen, isOpenKey: createRecipientSlideoverKey} = useIsOpen()

const initialLoading = ref(false)

const paginator = new Paginator(new RequestDriver(recipientIndexRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(() => {
    initialLoading.value = true
})

function loadRecipients(page: Number = undefined) {
    page ? paginator.refresh(page): paginator.refresh()
}

const loadRecipientsDebounced = debounce(() => {
    loadRecipients(1)
}, 250)
</script>