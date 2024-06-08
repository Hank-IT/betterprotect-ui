<template>
    <form @submit.prevent="emits('submit')" :action="url" :method="method">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Server</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">Specify the hostname and SSH connection details.</p>

                <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <BInput v-model="form" :errors="formErrors" id="hostname" name="hostname" class="sm:col-span-4">
                        <template #label>
                            Hostname
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="ssh_user" name="ssh_user" class="sm:col-span-2">
                        <template #label>
                            SSH user
                        </template>
                    </BInput>

                    <BTextarea v-if="mode === 'create'" v-model="form" :errors="formErrors" id="ssh_private_key" name="ssh_private_key" class="sm:col-span-3">
                        <template #label>
                            SSH private key
                        </template>
                    </BTextarea>

                    <div v-else class="sm:col-span-3">
                        <label for="ssh_private_key" class="block text-sm font-medium leading-6 text-gray-900">
                            SSH private key
                        </label>
                        <div class="mt-2">
                            <textarea v-model="form.ssh_private_key"
                                      id="ssh_private_key"
                                      name="ssh_private_key"
                                      rows="3"
                                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="ssh_private_key-error">
                            <template v-for="error in formErrors.ssh_private_key">
                                {{ error }}
                            </template>
                        </p>

                        <div class="relative flex items-start">
                            <div class="flex h-6 items-center">
                                <input v-model="keepSSHPrivateKey" id="keepSSHPrivateKey" name="keepSSHPrivateKey" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                            </div>
                            <div class="ml-3 text-sm leading-6">
                                <label for="keepSSHPrivateKey" class="font-medium text-gray-900">Keep current key</label>
                            </div>
                        </div>
                    </div>

                    <BTextarea v-model="form" :errors="formErrors" id="ssh_public_key" name="ssh_public_key" class="sm:col-span-3">
                        <template #label>
                            SSH public key
                        </template>
                    </BTextarea>

                    <BInput v-model="form" :errors="formErrors" id="ssh_command_sudo" name="ssh_command_sudo" class="sm:col-span-2 sm:col-start-1">
                        <template #label>
                            Sudo command
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="ssh_command_postqueue" name="ssh_command_postqueue" class="sm:col-span-2">
                        <template #label>
                            Postqueue command
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="ssh_command_postsuper" name="ssh_command_postsuper" class="sm:col-span-2">
                        <template #label>
                            Postsuper command
                        </template>
                    </BInput>
                </div>
            </div>

            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Postfix database</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">This is the database where Betterprotect stores the
                    policy on the postfix server.</p>

                <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <BInput v-model="form" :errors="formErrors" id="postfix_db_host" name="postfix_db_host" class="sm:col-span-4">
                        <template #label>
                            Hostname
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="postfix_db_port" name="postfix_db_port" class="sm:col-span-2">
                        <template #label>
                            Port
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="postfix_db_name" name="postfix_db_name" class="sm:col-span-6">
                        <template #label>
                            Database
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="postfix_db_user" name="postfix_db_user" class="sm:col-span-3">
                        <template #label>
                            User
                        </template>
                    </BInput>

                    <BInput v-if="mode === 'create'" v-model="form" :errors="formErrors" id="postfix_db_password" name="postfix_db_password" type="password" class="sm:col-span-3">
                        <template #label>
                            Password
                        </template>
                    </BInput>

                    <div v-else class="sm:col-span-3">
                        <label for="postfix_db_password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div class="mt-2 flex rounded-md shadow-sm">
                            <div class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                <div class="flex h-6 items-center">
                                    <input v-model="keepPostfixDbPassword" id="keepPostfixDbPassword" name="keepPostfixDbPassword" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                                </div>
                                <div class="ml-3 text-sm leading-6">
                                    <label for="keepPostfixDbPassword" class="font-medium text-gray-900">Keep password</label>
                                </div>
                            </div>
                            <input
                                v-model="form.postfix_db_password"
                                :disabled="keepLogDbPassword"
                                type="password"
                                name="postfix_db_password"
                                id="postfix_db_password"
                                class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="postfix_db_password-error">
                            <template v-for="error in formErrors.postfix_db_password">
                                {{ error }}
                            </template>
                        </p>
                    </div>
                </div>
            </div>

            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Log database (legacy)</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">This is the database containing the postfix logs on the postfix server.</p>

                <div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <BInput v-model="form" :errors="formErrors" id="log_db_host" name="log_db_host" class="sm:col-span-4">
                        <template #label>
                            Hostname
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="log_db_port" name="log_db_port" class="sm:col-span-2">
                        <template #label>
                            Port
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="log_db_name" name="log_db_name" class="sm:col-span-6">
                        <template #label>
                            Database
                        </template>
                    </BInput>

                    <BInput v-model="form" :errors="formErrors" id="log_db_user" name="log_db_user" class="sm:col-span-3">
                        <template #label>
                            User
                        </template>
                    </BInput>

                    <BInput v-if="mode === 'create'" v-model="form" :errors="formErrors" id="log_db_password" name="log_db_password" type="password" class="sm:col-span-3">
                        <template #label>
                            Password
                        </template>
                    </BInput>

                    <div v-else class="sm:col-span-3">
                        <label for="log_db_password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div class="mt-2 flex rounded-md shadow-sm">
                            <div class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                                <div class="flex h-6 items-center">
                                    <input v-model="keepLogDbPassword" id="logDbPasswordDisabled" name="logDbPasswordDisabled" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                                </div>
                                <div class="ml-3 text-sm leading-6">
                                    <label for="logDbPasswordDisabled" class="font-medium text-gray-900">Keep password</label>
                                </div>
                            </div>
                            <input
                                v-model="form.log_db_password"
                                :disabled="keepLogDbPassword"
                                type="password"
                                name="log_db_password"
                                id="log_db_password"
                                class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <p class="mt-2 text-sm text-red-600" id="log_db_password-error">
                            <template v-for="error in formErrors.log_db_password">
                                {{ error }}
                            </template>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button @click="router.push({ name: 'server.index' })" type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
            <button type="submit" class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                Save
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import BInput from '@/ui/BInput.vue'
import BTextarea from '@/ui/BTextarea.vue'
import {useRouter} from 'vue-router'
import {useModelWrapper} from '@hank-it/ui/vue'
import usePasswordInputHandling from '@/composables/usePasswordInputHandling.ts'

const props = defineProps({
    mode: {
        type: String,
        default: 'create',
    },
    url: String,
    method: String,
    modelValue: Object,
    formErrors: Object,
})

const emits = defineEmits(['submit', 'update:modelValue'])

const router = useRouter()

const form = useModelWrapper(props, emits)

const keepLogDbPassword = usePasswordInputHandling(() => {
    form.value.log_db_password = null
})

const keepPostfixDbPassword = usePasswordInputHandling(() => {
    form.value.postfix_db_password = null
})

const keepSSHPrivateKey = usePasswordInputHandling(() => {
    form.value.ssh_private_key = null
})
</script>