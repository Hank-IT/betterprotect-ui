<template>
    <BDialog v-model="isOpen">
        <template #title>
            <slot name="title" />
        </template>

        <template #icon>
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
        </template>

        <template #description>
            <div class="mt-2">
                <p class="text-sm text-gray-500">
                    <slot name="description" />
                </p>
            </div>
        </template>

        <template #footer>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="emits('action')">
                    <slot name="action" />
                </button>
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="isOpen = false">Cancel</button>
            </div>
        </template>
    </BDialog>
</template>

<script setup lang="ts">
import BDialog from '@/ui/BDialog.vue'
import {ExclamationTriangleIcon} from '@heroicons/vue/24/outline'
import {useModelWrapper} from '@hank-it/ui/vue'

const props = defineProps({
    modelValue: Boolean,
})

const emits = defineEmits(['update:modelValue', 'action'])

const isOpen = useModelWrapper(props, emits)
</script>