<template>
    <div>
        <div v-if="aggregatedLogDetailsRequest.isLoading()" class="absolute w-full top-16 left-0">
            <ProgressLoader/>
        </div>

        <div v-if="details">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold leading-6 text-gray-900">Details Mail {{ details.queue_id }}</h1>
                </div>
            </div>

            <div class="w-full py-4 mt-8 px-16">
                <div class="relative flex items-center justify-between w-full">
                    <div class="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>
                    <div
                        class="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-900 transition-all duration-500">
                    </div>
                    <div
                        class="relative z-10 grid w-20 h-10 font-bold text-white transition-all duration-300 bg-gray-900 rounded-full place-items-center">
                        <h6 class="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-white">
                            Client
                        </h6>

                        <div class="absolute -bottom-[4rem] w-max text-center">
                            <p class="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                {{ details.client_ip }}
                            </p>
                            <p class="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                {{ details.client_hostname }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="relative z-10 grid w-20 h-10 font-bold text-white transition-all duration-300 bg-gray-900 rounded-full place-items-center">
                        <h6 class="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                            Server
                        </h6>

                        <div class="absolute -bottom-[2rem] w-max text-center">
                            <p class="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                {{ details.source }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20">
                <div class="mt-6">
                    <dl class="grid grid-cols-1 sm:grid-cols-2">
                        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Timestamp</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2" :title="details.timestamp">{{ fromISOToLocalDateTimeString(details.timestamp) }}</dd>
                        </div>
                        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Sender</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                <template v-if="details.from">
                                    {{ details.from }}
                                </template>
                                <span v-else class="italic">Unknown</span>
                            </dd>
                        </div>
                        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Queue ID</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{ details.queue_id }}</dd>
                        </div>
                        <div class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Message ID</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                <template v-if="details.message_id">
                                    {{ details.message_id }}
                                </template>
                                <span v-else class="italic">Unknown</span>
                            </dd>
                        </div>
                        <div v-if="details.encryption_cipher" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Encryption</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{{ details.encryption_protocol }}
                                {{ details.encryption_cipher }} {{ details.encryption_keysize }}
                            </dd>
                        </div>
                        <div v-if="details.action" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Action</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.action }}
                            </dd>
                        </div>
                        <div v-if="details.status_data" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Status Data</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.status_data }}
                            </dd>
                        </div>
                        <div v-if="details.status_data" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Helo</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.helo }}
                            </dd>
                        </div>
                        <div v-if="details.status_code_enhanced" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Status code</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.status_code_enhanced }}
                            </dd>
                        </div>
                        <div v-if="details.smtp_state" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Stage</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.smtp_state }}
                            </dd>
                        </div>
                        <div v-if="details.status_message" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Status Message</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.status_message }}
                            </dd>
                        </div>
                        <div v-if="details.amavis_id" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Amavis</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.amavis_id }} - {{ details.amavis_action }} - {{ details.amavis_category }}
                            </dd>
                        </div>
                        <div v-if="details.nrcpt" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Recipients</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.nrcpt }}
                            </dd>
                        </div>
                        <div v-if="details.size" class="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Size</dt>
                            <dd class="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                                {{ details.size }}
                            </dd>
                        </div>
                        <div v-if="details.headers.length > 0" class="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-gray-900">Headers</dt>
                            <dd class="mt-2 text-sm text-gray-900">
                                <ul role="list" class="divide-y divide-gray-100 rounded-md">
                                    <li v-for="header in details.headers"
                                        class="flex items-center justify-between py-4 pr-5 text-sm leading-6">
                                        <div class="flex w-0 flex-1 items-center">
                                            <div class="flex min-w-0 flex-1 gap-2">
                                                <span class="flex-shrink-0 text-gray-400">{{ header.name }}</span>
                                                <span class="truncate font-medium">{{ header.value }}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div v-if="details.action !== 'reject' && details.amavis_action !== 'Blocked'">
                <Disclosure v-slot="{ open }" default-open>
                    <DisclosureButton
                        class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500/75"
                    >
                        <span>Delivery ({{ details.recipients.length }} attempt{{ details.recipients.length === 1 ? '': 's' }})</span>
                        <ChevronUpIcon
                            :class="open ? 'rotate-180 transform' : ''"
                            class="h-5 w-5 text-primary-500"
                        />
                    </DisclosureButton>
                    <DisclosurePanel class="pt-4 text-sm text-gray-500">
                        <div v-for="recipient in details.recipients">
                            <div>
                                <div class="px-4 py-6">
                                    <h3 class="text-base font-semibold leading-7 text-gray-900">{{ recipient.to }}</h3>
                                </div>
                                <dl class="divide-y divide-gray-100">
                                    <div v-if="recipient.relay_ip" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">Relay</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.relay_ip }} ({{ recipient.relay_hostname }}) on port {{ recipient.relay_port }}</dd>
                                    </div>
                                    <div v-if="recipient.status" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                        <dt class="text-sm font-medium text-gray-900">Status</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">
                                            {{ recipient.status }}
                                        </dd>
                                    </div>
                                    <div v-if="details.status_message" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">Response</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ details.status_message }}</dd>
                                    </div>
                                    <div v-if="recipient.smtp_response" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">Response</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.smtp_response }}</dd>
                                    </div>
                                    <div v-if="recipient.smtp_lostconn_data" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">SMTP lost connection details</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.smtp_lostconn_data }}</dd>
                                    </div>
                                    <div v-if="recipient.smtp_stage" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">SMTP Stage</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.smtp_stage }}</dd>
                                    </div>
                                    <div v-if="recipient.pix_workaround" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">Pix Workaround</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.pix_workaround }}</dd>
                                    </div>
                                    <div v-if="recipient.delay_before_qmgr" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">Delay (before qmgr/in qmgr/conn/transmission/total)</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.delay_before_qmgr }}/{{ recipient.delay_in_qmgr }}/{{ recipient.delay_conn_setup }}/{{ recipient.delay_transmission }}/{{ recipient.delay }}</dd>
                                    </div>
                                    <div v-if="recipient.dsn" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt class="text-sm font-medium text-gray-900">DSN</dt>
                                        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{{ recipient.dsn }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                    </DisclosurePanel>
                </Disclosure>

                <Disclosure v-if="details.lines.length > 0" as="div" class="mt-2" v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500/75"
                    >
                        <span>Processed lines</span>
                        <ChevronUpIcon
                            :class="open ? 'rotate-180 transform' : ''"
                            class="h-5 w-5 text-primary-500"
                        />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 text-sm text-gray-500">
                        <div class="mt-2 flow-root">
                            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table class="min-w-full divide-y divide-gray-300">
                                        <thead>
                                        <tr>
                                            <th scope="col"
                                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                Timestamp
                                            </th>
                                            <th scope="col"
                                                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Message
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200">
                                        <tr v-for="line in details.lines" :key="line.timestamp">
                                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0" :title="line.timestamp">
                                                {{ fromISOToLocalDateTimeString(line.timestamp) }}
                                            </td>
                                            <td class=" px-3 py-4 text-sm text-gray-500">
                                                {{ line.message }}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {AggregatedLogDetailsRequest} from '@/api/requests/logging/AggregatedLogDetailsRequest'
import {ref} from 'vue'
import {debounce} from 'lodash'
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import useDateHandling from '@/composables/useDateHandling'

const props = defineProps({
    id: String,
})

const {fromISOToLocalDateTimeString} = useDateHandling()

const aggregatedLogDetailsRequest = new AggregatedLogDetailsRequest(props.id)

const details = ref(null)

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