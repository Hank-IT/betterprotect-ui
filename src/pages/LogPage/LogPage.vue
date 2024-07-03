<template>
    <div v-if="aggregatedLogRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Logging</h1>
                <p class="mt-2 text-sm text-gray-700">This is the aggregated log.
                    <RouterLink :to="{ name: 'logging.raw' }" class="text-primary-700 hover:text-primary-800">
                        You may view the raw non-aggregated mail log here.
                    </RouterLink>
                </p>
            </div>
        </div>

        <div class="sm:flex sm:items-center mt-6">
            <div class="sm:flex-auto">
                <div class="flex ">
                    <div class="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                            ref="searchRef"
                            v-model="search"
                            name="search"
                            type="text"
                            placeholder="Search"
                            class="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <button @click="isSearchFieldsSlideoverOpen = true" type="button" class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Configure fields
                    </button>
                </div>
            </div>

            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <div ref="dateRangePicker" class="flex items-center">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                            </svg>
                        </div>
                        <input @changeDate="updateStartDate" :value="startDate" name="start" type="text" class="bg-gray-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 ps-10" placeholder="Select date start">
                    </div>
                    <span class="mx-4 text-gray-500">to</span>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                            </svg>
                        </div>
                        <input @changeDate="updateEndDate" :value="endDate" name="end" type="text" class="bg-gray-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 ps-10" placeholder="Select date end">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="maxDocumentsWarning" class="mt-6">
            <div class="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            Your query yielded more than 10000 results.
                            {{ ' ' }}
                            <span class="font-medium text-yellow-700">If you cannot find what you seek, decrease the date range or use a more specific search term.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="errors" class="mt-6">
            <div class="rounded-md bg-red-50 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">{{ errors.message }}</h3>
                        <div v-if="errors.errors.length > 1" class="mt-2 text-sm text-red-700">
                            <ul role="list" class="list-disc space-y-1 pl-5">
                                <li v-for="error in errors.errors">{{ error[0] }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
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
                                Timestamp
                            </th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Sender
                            </th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Recipients
                            </th>
                            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="mail in paginator.getPageData()" :key="mail.timestamp">
                            <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                <div class="flex items-center">
                                    <div>
                                        <div class="font-medium text-gray-900">{{ fromISOToRelativeString(mail.timestamp) }}</div>
                                        <div class="mt-1 text-gray-500">{{ fromISOToLocalDateTimeString(mail.timestamp) }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                <div class="flex items-center">
                                    <div class="ml-4">
                                        <div class="font-medium text-gray-900 truncate">{{ mail.from }}</div>
                                        <div v-if="mail.client_hostname !== 'unknown'" class="mt-1 text-gray-500">{{ mail.client_hostname }}</div>
                                        <div v-else class="mt-1 text-gray-500">{{ mail.client_ip }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <div class="font-medium text-gray-900 truncate">
                                            {{ mail.recipients[0].to }}
                                            <span class="text-gray-600" v-if="mail.recipients.length > 1">and {{ mail.recipients.length - 1 }} more</span>
                                        </div>
                                        <div v-if="mail.recipients[0].relay_hostname !== 'unknown'" class="mt-1 text-gray-500">{{ mail.recipients[0].relay_hostname }}</div>
                                        <div v-else class="mt-1 text-gray-500">{{ mail.recipients[0].relay_ip }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm">
                                <template v-if="mail.recipients.length > 1">
                                    <span class="text-gray-700 italic">Indeterminate</span>
                                </template>
                                <template v-else>
                                    <span class="capitalize" :class="{ 'text-green-700': mail.recipients[0].status == 'sent', 'text-yellow-700': mail.recipients[0].status == 'deferred' }">{{ mail.recipients[0].status }}</span>
                                    <span class="capitalize" :class="{ 'text-red-700': mail.action == 'reject' }">{{ mail.action }}</span>
                                    <span class="capitalize" v-if="mail.recipients[0].status !== 'sent'" :class="{ 'text-red-700': mail.amavis_action == 'amavis_action' }">{{ mail.amavis_action }}</span>
                                </template>
                            </td>

                            <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                <RouterLink
                                    :to="{ name: 'logging.details', params: { id: mail.queue_id } }"
                                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                                    Show
                                </RouterLink>
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

    <NoMatchesFound v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" :search="search" :start-date="startDate" :end-date="endDate" :key="search" />

    <SearchFieldsSlideover v-model="isSearchFieldsSlideoverOpen" v-model:selected-fields="selectedFields" />
 </template>

<script setup lang="ts">
import {AggregatedLogRequest} from '@/api/requests/logging/AggregatedLogRequest'
import {computed, onMounted, ref} from 'vue'
import BPagination from '@/ui/BPagination.vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import useDateHandling from '@/composables/useDateHandling'
import {useRouter} from 'vue-router'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {DateRangePicker} from 'flowbite-datepicker';
import {DateTime} from 'luxon'
import {debounce} from 'lodash'
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import SearchFieldsSlideover from '@/pages/LogPage/components/SearchFieldsSlideover.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import NoMatchesFound from '@/pages/LogPage/components/NoMatchesFound.vue'

const {fromISOToLocalDateTimeString, fromISOToRelativeString} = useDateHandling()

const router = useRouter()

const maxDocumentsWarning = ref(false)
const dateRangePicker = ref(null)
const internalStartDate = ref(DateTime.now().minus({ days: 2 }).toFormat('yyyy-MM-dd'))
const internalEndDate = ref(DateTime.now().toFormat('yyyy-MM-dd'))
const internalSearch = ref('')
const errors = ref(null)
const searchRef = ref(null)

const internalSelectedFields = ref([
    'postfix_queueid',
    'postfix_client_hostname',
    'postfix_client_ip',
    'postfix_relay_ip',
    'postfix_relay_hostname',
    'postfix_from',
    'postfix_to',
    'postfix_to',
])

const selectedFields = computed({
    get() {
        return internalSelectedFields.value
    },
    set(value) {
        internalSelectedFields.value = value

        aggregatedLogRequest.withParams({
            search_fields: value,
        })
    }
})

const {isOpen: isSearchFieldsSlideoverOpen} = useIsOpen(open => {
    if (! open) {
        load(1)
    }
})

const aggregatedLogRequest = new AggregatedLogRequest().withParams({
    start_date: internalStartDate.value,
    end_date: internalEndDate.value,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    search_fields: selectedFields.value,
})

const updateStartDate = debounce(event => {
    startDate.value = DateTime.fromJSDate(event.detail.date).toFormat('yyyy-MM-dd')
}, 1)

const updateEndDate = debounce(event => {
    endDate.value = DateTime.fromJSDate(event.detail.date).toFormat('yyyy-MM-dd')
}, 1)

const startDate = computed({
    set(value) {
        internalStartDate.value = value

        aggregatedLogRequest.withParams({
            start_date: value,
        })

        load(1)
    },
    get() {
        return internalStartDate.value
    }
})

const endDate = computed({
    set(value) {
        internalEndDate.value = value

        aggregatedLogRequest.withParams({
            end_date: value,
        })

        load()
    },
    get() {
        return internalEndDate.value
    }
})

const search = computed({
    set(value) {
        internalSearch.value = value

        aggregatedLogRequest.withParams({
            search: value,
        })

        loadDebounced(1)
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

const initialLoading = ref(false)

const paginator = new Paginator(new RequestDriver(aggregatedLogRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(dto => {
    initialLoading.value = true

    maxDocumentsWarning.value = dto.getResponse().getBody().meta.relation !== 'eq'
}).catch(errorHandler)

function load(page: Number = undefined) {
    const promise = page ? paginator.refresh(page): paginator.refresh()

    errors.value = null

    promise.then(dto => {
        maxDocumentsWarning.value = dto.getResponse().getBody().meta.relation !== 'eq'
    }).catch(errorHandler)
}

const loadDebounced = debounce(() => {
    load(1)
}, 250)

onMounted(() => {
    new DateRangePicker(dateRangePicker.value, {
        autohide: true,
        format: 'yyyy-mm-dd',
    });

    searchRef.value.focus()
})

function errorHandler(exception) {
    exception.getError().getBodyPromise().then(response => {
        errors.value = response
    })
}
</script>