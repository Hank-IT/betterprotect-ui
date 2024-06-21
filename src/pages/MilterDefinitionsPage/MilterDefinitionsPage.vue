<template>
    <div v-if="milterIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Milter</h1>
                <p class="mt-2 text-sm text-gray-700">Define milters which Postfix uses to filter incoming mail.</p>
            </div>

            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
                <button @click="createMilterSlideoverOpen = true"
                        v-if="auth.check(['editor', 'administrator'])"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create milter
                </button>
            </div>
        </div>

        <div v-if="Object.keys(milters).length > 0" class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="relative">
                        <table class="min-w-full table-fixed divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 relative px-3 sm:w-12">
                                    Name
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Definition
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Description
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="milter in milters" :key="milter.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <span class="text-gray-700">{{ milter.name }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ milter.definition }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ milter.description }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <DeleteMilterButton
                                            v-if="auth.check(['editor', 'administrator'])"
                                            :id="milter.id"
                                            @success="loadMilters"
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="Object.keys(milters).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No milters</h3>
            <p class="mt-1 text-sm text-gray-500">
                    Get started by creating a milter.
            </p>
        </div>
    </div>

    <CreateMilterSlideover v-model="createMilterSlideoverOpen" @success="loadMilters" :key="createMilterSlideoverKey" />
</template>

<script setup lang="ts">
import {ref} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import {MilterIndexRequest, MilterIndexResponse} from '@/api/requests/milters/MilterIndexRequest'
import DeleteMilterButton from '@/pages/MilterDefinitionsPage/components/DeleteMilterButton.vue'
import CreateMilterSlideover from '@/pages/MilterDefinitionsPage/components/CreateMilterSlideover.vue'
import { useAuthStore } from '@/stores/auth'

const milters = ref({})

const {isOpen: createMilterSlideoverOpen, isOpenKey: createMilterSlideoverKey} = useIsOpen()

const initialLoading = ref(false)

const milterIndexRequest = new MilterIndexRequest()

const auth = useAuthStore()

function loadMilters() {
    return milterIndexRequest.send()
        .then((result: MilterIndexResponse) => {
            milters.value = result.getData()
        })
        .catch(error => {
            //
        })
}

loadMilters().then(() => {
    initialLoading.value = true
})
</script>