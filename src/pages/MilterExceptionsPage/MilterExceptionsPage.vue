<template>
    <div v-if="milterExceptionsIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Milter exceptions</h1>
                <p class="mt-2 text-sm text-gray-700">Define exceptions for milter processing.</p>
            </div>

            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
                <button @click="createMilterExceptionsSlideoverOpen = true"
                        v-if="auth.check(['editor', 'administrator'])"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create milter exception
                </button>
            </div>
        </div>

        <div v-if="Object.keys(milterExceptions).length > 0" class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="relative">
                        <table class="min-w-full table-fixed divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 relative px-3 sm:w-12">
                                    Client
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Milter
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Description
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="milterException in milterExceptions" :key="milterException.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <div v-if="! milterException.active" class="absolute inset-y-0 left-0 w-0.5 bg-yellow-400"></div>

                                    <span class="text-gray-700">{{ milterException.client_payload }}</span> <span class="italic text-gray-500">({{ milterException.client_type  }})</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span v-for="milter in milterException.milters" class="block text-gray-700">{{ milter.name }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span class="text-gray-700">{{ milterException.description }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <UpButton
                                            v-if="auth.check(['editor', 'administrator'])"
                                            entity="milter-exception"
                                            :id="milterException.id"
                                            @success="loadMilterExceptions"
                                    />
                                    <DownButton
                                            v-if="auth.check(['editor', 'administrator'])"
                                            entity="milter-exception"
                                            :id="milterException.id"
                                            @success="loadMilterExceptions"
                                    />
                                    <DisableButton
                                            v-if="milterException.active && auth.check(['editor', 'administrator'])"
                                            entity="milter-exception"
                                            :id="milterException.id"
                                            @success="loadMilterExceptions"
                                    />
                                    <EnableButton
                                            v-if="! milterException.active && auth.check(['editor', 'administrator'])"
                                            entity="milter-exception"
                                            :id="milterException.id"
                                            @success="loadMilterExceptions"
                                    />
                                    <DeleteMilterExceptionButton
                                            v-if="auth.check(['editor', 'administrator'])"
                                            :id="milterException.id"
                                            @success="loadMilterExceptions"
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="Object.keys(milterExceptions).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No milters exceptions</h3>
            <p class="mt-1 text-sm text-gray-500">
                Get started by creating a milter exception.
            </p>
        </div>
    </div>

    <CreateMilterExceptionSlideover v-model="createMilterExceptionsSlideoverOpen" @success="loadMilterExceptions" :key="createMilterExceptionsSlideoverKey" />
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import { MilterExceptionIndexRequest, type MilterExceptionResource } from '@/api/requests/milters/MilterExceptionIndexRequest'
import CreateMilterExceptionSlideover from '@/pages/MilterExceptionsPage/components/CreateMilterExceptionSlideover.vue'
import DeleteMilterExceptionButton from '@/pages/MilterExceptionsPage/components/DeleteMilterExceptionButton.vue'
import EnableButton from '@/components/EnableButton.vue'
import DownButton from '@/components/DownButton.vue'
import DisableButton from '@/components/DisableButton.vue'
import UpButton from '@/components/UpButton.vue'
import { useAuthStore } from '@/stores/auth'

const milterExceptions = ref({})

const {isOpen: createMilterExceptionsSlideoverOpen, isOpenKey: createMilterExceptionsSlideoverKey} = useIsOpen()

const initialLoading = ref(false)

const milterExceptionsIndexRequest = new MilterExceptionIndexRequest()

const auth = useAuthStore()

function loadMilterExceptions() {
    return milterExceptionsIndexRequest.send()
        .then((result: MilterExceptionResource) => {
            milterExceptions.value = result.getData()
        })
        .catch(error => {
            //
        })
}

loadMilterExceptions().then(() => {
    initialLoading.value = true
})
</script>