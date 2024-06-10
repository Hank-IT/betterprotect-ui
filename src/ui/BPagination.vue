<template>
    <div class="flex items-center justify-between border-t border-gray-200 bg-white py-3 px-3">
        <div class="flex flex-1 justify-between sm:hidden">
            <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-75"
                :disabled="pageNumber === 1"
                :class="[pageNumber === 1 ? 'cursor-not-allowed': '']"
                @click="pageNumber--"
            >
                Previous
            </button>
            <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-75"
                :disabled="pageNumber === pageCount"
                :class="[pageNumber === pageCount ? 'cursor-not-allowed': '']"
                @click="pageNumber++"
            >
                Next
            </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Showing
                    {{ ' ' }}
                    <span class="font-medium">{{ fromCount }}</span>
                    {{ ' ' }}
                    to
                    {{ ' ' }}
                    <span class="font-medium">{{ toCount > totalCount ? totalCount: toCount }}</span>
                    {{ ' ' }}
                    of
                    {{ ' ' }}
                    <span class="font-medium">{{ totalCount }}</span>
                    {{ ' ' }}
                    items
                </p>
            </div>
            <div v-if="pageCount > 1">
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        :disabled="pageNumber === 1"
                        :class="[pageNumber === 1 ? 'cursor-not-allowed': '']"
                        @click="pageNumber--"
                    >
                        <ChevronLeftIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        v-if="! pages.includes(1)"
                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        :class="[pageNumber === 1 ? 'z-10 bg-gray-50 border-primary-500 text-primary-700': 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50']"
                        @click="pageNumber = 1"
                    >
                        1
                    </button>

                    <span
                        v-if="! pages.includes(2)"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none"
                    > ... </span>

                    <button
                        v-for="page in pages"
                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        :class="[pageNumber === page ? 'z-10 bg-gray-50 border-primary-500 text-primary-700': 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50']"
                        @click="pageNumber = page"
                    >
                        {{ page }}
                    </button>


                    <span
                        v-if="! pages.includes(pageCount - 1)"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none"
                    > ... </span>

                    <button
                        v-if="! pages.includes(pageCount)"
                        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        :class="[pageNumber === pageCount ? 'z-10 bg-gray-50 border-primary-500 text-primary-700': 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50']"
                        @click="pageNumber = pageCount"
                    >
                        {{ pageCount }}
                    </button>

                    <button
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        :disabled="pageNumber === pageCount"
                        :class="[pageNumber === pageCount ? 'cursor-not-allowed': '']"
                        @click="pageNumber++"
                    >
                        <ChevronRightIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import {useModelWrapper} from '@hank-it/ui/vue'
import {getDisplayablePages} from '@hank-it/ui/service/pagination'
import {ref, watch} from 'vue'

const props = defineProps({
    modelValue: {
        default: undefined,
    },
    pageCount: Number,
    fromCount: Number,
    toCount: Number,
    totalCount: Number
})

const emits = defineEmits(['update:modelValue'])

const pages = ref([])

const pageNumber = useModelWrapper(props, emits, {
    callback: value => {
        pages.value = getDisplayablePages(props.pageCount, value, 6)
    }
})

watch(
    () => props.pageCount,
    () => {
        pages.value = getDisplayablePages(props.pageCount, pageNumber.value, 6)

    },
    {
        immediate: true,
    }
)
</script>