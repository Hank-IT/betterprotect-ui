<template>
    <div v-if="ruleIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Rules</h1>
                <p class="mt-2 text-sm text-gray-700">Rules are processed in the displayed order. First match determines the response.</p>
            </div>
        </div>

        <div class="sm:flex sm:items-center mt-6">
            <div class="sm:flex-auto">
                <input
                    ref="searchRef"
                    v-model="search"
                    name="search"
                    type="text"
                    placeholder="Search"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button @click="createRuleSlideoverOpen = true"
                        v-if="auth.check(['authorizer', 'editor', 'administrator'])"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create rule
                </button>
            </div>
        </div>

        <div v-if="Object.keys(rules).length > 0" class="mt-8 flow-root">
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
                                    Sender
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="rule in rules" :key="rule.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <div v-if="! rule.active" class="absolute inset-y-0 left-0 w-0.5 bg-yellow-400"></div>
                                    <span v-if="rule.client_type === '*'" class="text-red-500 uppercase">
                                        Any
                                    </span>
                                    <template v-else>
                                        <span class="text-gray-700">{{ rule.client_payload }}</span> <span class="italic text-gray-500">({{ rule.client_type  }})</span>
                                    </template>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span v-if="rule.sender_type === '*'" class="text-red-500 uppercase">
                                        Any
                                    </span>
                                    <template v-else>
                                        <span class="text-gray-700">{{ rule.sender_payload }}</span> <span class="italic text-gray-500">({{ rule.sender_type  }})</span>
                                    </template>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <span v-if="rule.action === 'ok'" class="text-green-500 uppercase">{{ rule.action }}</span>
                                    <span v-if="rule.action === 'reject'" class="text-red-500 uppercase">{{ rule.action }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <UpButton v-if="auth.check(['authorizer', 'editor', 'administrator'])" entity="client-sender-access" :id="rule.id" @success="loadRules" />
                                    <DownButton v-if="auth.check(['authorizer', 'editor', 'administrator'])" entity="client-sender-access" :id="rule.id" @success="loadRules" />
                                    <DisableButton v-if="rule.active && auth.check(['authorizer', 'editor', 'administrator'])" entity="client-sender-access" :id="rule.id" @success="loadRules" />
                                    <EnableButton v-if="! rule.active && auth.check(['authorizer', 'editor', 'administrator'])" entity="client-sender-access" :id="rule.id" @success="loadRules" />
                                    <DeleteRuleButton v-if="auth.check(['authorizer', 'editor', 'administrator'])" :id="rule.id" @success="loadRules" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="Object.keys(rules).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No rules</h3>
            <p class="mt-1 text-sm text-gray-500">
                <template v-if="search === ''">
                    Get started by creating a rule.
                </template>
                <template v-else>
                    No matches found for {{ search }}
                </template>
            </p>
        </div>
    </div>

    <CreateRuleSlideover v-model="createRuleSlideoverOpen" @success="loadRules" :key="createRuleSlideoverKey" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {RuleIndexRequest} from '@/api/requests/rules/RuleIndexRequest.ts'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import CreateRuleSlideover from '@/pages/RulesPage/components/CreateRuleSlideover.vue'
import {useIsOpen} from '@hank-it/ui/vue'
import UpButton from '@/components/UpButton.vue'
import DownButton from '@/components/DownButton.vue'
import DisableButton from '@/components/DisableButton.vue'
import EnableButton from '@/components/EnableButton.vue'
import DeleteRuleButton from '@/pages/RulesPage/components/DeleteRuleButton.vue'
import {debounce} from 'lodash'
import { useAuthStore } from '@/stores/auth.ts'

const rules = ref({})

const internalSearch = ref('')

const search = computed({
    set(value) {
        internalSearch.value = value

        loadRuleDebounced()
    },
    get() {
        return internalSearch.value
    }
})

const {isOpen: createRuleSlideoverOpen, isOpenKey: createRuleSlideoverKey} = useIsOpen()

const auth = useAuthStore()

const ruleIndexRequest = new RuleIndexRequest()

const initialLoading = ref(false)

const searchRef = ref(null)

function loadRules() {
    return ruleIndexRequest
        .setParams({
            search: search.value
        })
        .send()
        .then(response => {
            rules.value = response.getData()
        })
        .catch(exception => {
            //
        })
}

const loadRuleDebounced = debounce(loadRules, 250, {
    leading: true,
})

loadRules().then(() => {
    initialLoading.value = true
})

onMounted(() => {
    searchRef.value.focus()
})
</script>