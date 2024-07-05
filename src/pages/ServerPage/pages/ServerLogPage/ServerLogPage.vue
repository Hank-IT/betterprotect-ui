<template>
    <div>
        <div v-if="serverSyslogRequest.isLoading()" class="absolute w-full top-16 left-0">
            <ProgressLoader/>
        </div>

        <div>
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Server log</h1>
                    <p class="mt-2 text-sm text-gray-700">This is the legacy syslog. Use the modern log viewer for a better experience.</p>
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
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>
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
                                    Received
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Message
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="mail in paginator.getPageData()">
                                <td class=" py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    {{ mail.received_at }}
                                </td>
                                <td class="px-3 py-4 text-sm">
                                    {{ mail.message }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <BPagination
                v-model="pageNumber"
                v-model:page-size="pageSize"
                @refresh="load"
                :page-count="paginator.getLastPage()"
                :from-count="paginator.getFromItemNumber()"
                :to-count="paginator.getToItemNumber()"
                :total-count="paginator.getTotal()"
            />
        </div>

        <div v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" class="text-center mt-8">
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
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {XCircleIcon} from '@heroicons/vue/20/solid'
import BPagination from '@/ui/BPagination.vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {DateRangePicker} from 'flowbite-datepicker';
import {DateTime} from 'luxon'
import {debounce} from 'lodash'
import {useRouter} from 'vue-router'
import {ServerSyslogRequest} from '@/api/requests/servers/ServerSyslogRequest'

const props = defineProps({
    id: {
        required: true,
    }
})

const router = useRouter()

const initialLoading = ref(false)
const dateRangePicker = ref(null)
const internalStartDate = ref(DateTime.now().minus({ days: 2 }).toFormat('yyyy-MM-dd'))
const internalEndDate = ref(DateTime.now().toFormat('yyyy-MM-dd'))
const internalSearch = ref(null)
const errors = ref(null)
const searchRef = ref(null)

const serverSyslogRequest = new ServerSyslogRequest(props.id).withParams({
    start_date: internalStartDate.value,
    end_date: internalEndDate.value,
    search: internalSearch.value,
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

        serverSyslogRequest.withParams({
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

        serverSyslogRequest.withParams({
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

        serverSyslogRequest.withParams({
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

const pageSize = computed({
    set(value) {
        paginator.setPageSize(value)
    },
    get() {
        return paginator.getPageSize()
    }
})

const paginator = new Paginator(new RequestDriver(serverSyslogRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(dto => {
    initialLoading.value = true
}).catch(errorHandler)

function load(page: Number = undefined) {
    const promise = page ? paginator.refresh(page): paginator.refresh()

    errors.value = null

    promise.catch(errorHandler)
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
    console.log(exception)

    exception.getError().getBodyPromise().then(response => {
        errors.value = response
    })
}
</script>