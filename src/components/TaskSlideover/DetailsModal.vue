<template>
    <BDialog v-model="isOpen">
        <template #title>
            Details
        </template>

        <template #description>
            <div class="mt-2">
                <ul role="list" class="divide-y divide-gray-100" @scroll="scroll">
                    <li v-for="progress in payload.progress" :key="progress.id" class="flex justify-between gap-x-6 py-5">
                        <div class="flex min-w-0 gap-x-4">
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm font-semibold leading-6 text-gray-500" :title="fromISOToLocalDateTimeString(progress.created_at)">{{ fromISOToRelativeString(progress.created_at) }}</p>
                                <p class="mt-1 text-xs leading-5 text-gray-900">{{ progress.description }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </template>

        <template #footer>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="isOpen = false">Close</button>
            </div>
        </template>
    </BDialog>
</template>

<script setup lang="ts">
import { useModelWrapper } from '@hank-it/ui/vue'
import BDialog from '@/ui/BDialog.vue'
import useDateHandling from '@/composables/useDateHandling'

const {fromISOToLocalDateTimeString, fromISOToRelativeString} = useDateHandling()

const props = defineProps({
    modelValue: Boolean,
    payload: Object,
})

const emits = defineEmits(['update:modelValue', 'success'])

const isOpen = useModelWrapper(props, emits)
</script>

<style scoped>

</style>