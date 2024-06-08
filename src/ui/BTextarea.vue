<template>
    <div>
        <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
            <slot name="label" />
        </label>
        <div class="mt-2">
             <textarea v-model="value[name]"
                       :id="id"
                       :name="name"
                       :rows="rows"
                       class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"/>
        </div>
        <p class="mt-2 text-sm text-red-600" :id="`${name}-error`">
            <template v-for="error in errors[name]">
                {{ error }}
            </template>
        </p>
    </div>
</template>

<script setup lang="ts">
import { useModelWrapper } from '@hank-it/ui/vue'

const props = defineProps({
    modelValue: Object,
    errors: Object,
    id: String,
    name: String,
    rows: {
        type: Number,
        default: 3,
    },
    type: {
        type: String,
        default: 'text',
    }
})

const emit = defineEmits(['update:modelValue'])

const value = useModelWrapper(props, emit)
</script>