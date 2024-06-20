<template>
    <div v-if="userIndexRequest.isLoading()" class="absolute w-full top-16 left-0">
        <ProgressLoader/>
    </div>

    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
                <p class="mt-2 text-sm text-gray-700">Create users which can sign in. LDAP users are created automatically on first sign in.</p>
            </div>
        </div>

        <div class="sm:flex sm:items-center mt-6">
            <div class="sm:flex-auto">
                <input
                        v-model="search"
                        name="search"
                        type="text"
                        placeholder="Search"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
                <button @click="createUserSlideoverOpen = true"
                        type="button"
                        class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Create user
                </button>
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
                                    Username
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    LDAP GUID
                                </th>
                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Role
                                </th>
                            </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="user in paginator.getPageData()" :key="user.id">
                                <td class="whitespace-nowrap py-4 pr-3 text-sm font-medium relative px-3 sm:w-12">
                                    <span class="text-gray-700">{{ user.username }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ user.guid }}</span>
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                    <span class="text-gray-700">{{ user.role }}</span>
                                </td>
                                <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 space-x-2">
                                    <button @click="updateUserRoleId = user.id" type="button" class="relative rounded bg-primary-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                                        Edit role
                                    </button>
                                    <button @click="updateUserPasswordId = user.id" type="button" class="relative rounded bg-primary-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                                        Edit password
                                    </button>
                                    <DeleteUserButton v-if="user.id !== auth.user.id" :id="user.id" @success="loadUsers" />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <BPagination
                            v-model="pageNumber"
                            :page-count="paginator.getLastPage()"
                            :from-count="paginator.getFromItemNumber()"
                            :to-count="paginator.getToItemNumber()"
                            :total-count="paginator.getTotal()"
                    />
                </div>
            </div>
        </div>

        <div v-if="Object.keys(paginator.getPageData()).length === 0 && initialLoading" class="text-center mt-8">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No users</h3>
            <p class="mt-1 text-sm text-gray-500">
                <template v-if="search === ''">
                    Get started by creating a user.
                </template>
                <template v-else>
                    No matches found for {{ search }}
                </template>
            </p>
        </div>
    </div>

    <CreateUserSlideover v-model="createUserSlideoverOpen" @success="loadUsers(1)" :key="createUserSlideoverKey" />
    <UpdateUserRoleSlideover v-model="updateUserRoleSlideoverOpen" :id="updateUserRoleId" @success="loadUsers()" :key="updateUserRoleSlideoverKey" />
    <UpdateUserPasswordSlideover v-model="updateUserPasswordSlideoverOpen" :id="updateUserPasswordId" @success="loadUsers()" :key="updateUserPasswordSlideoverKey" />
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import {useIsOpen, useIsOpenFromVar} from '@hank-it/ui/vue'
import {Paginator, RequestDriver} from '@hank-it/ui/service/pagination'
import {debounce} from 'lodash'
import BPagination from '@/ui/BPagination.vue'
import { UserIndexRequest } from '@/api/requests/user/UserIndexRequest'
import CreateUserSlideover from '@/pages/UserManagementPage/components/CreateUserSlideover.vue'
import DeleteUserButton from '@/pages/UserManagementPage/components/DeleteUserButton.vue'
import { useAuthStore } from '@/stores/auth'
import UpdateUserRoleSlideover from '@/pages/UserManagementPage/components/UpdateUserRoleSlideover.vue'
import UpdateUserPasswordSlideover from '@/pages/UserManagementPage/components/UpdateUserPasswordSlideover.vue'

const internalSearch = ref('')

const userIndexRequest = new UserIndexRequest()

const auth = useAuthStore()

const search = computed({
    set(value) {
        internalSearch.value = value

        userIndexRequest.withParams({
            search: value
        })

        loadUsersDebounced(1)
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

const {isOpen: createUserSlideoverOpen, isOpenKey: createUserSlideoverKey} = useIsOpen()
const {fromVar: updateUserRoleId, isOpenFromVar: updateUserRoleSlideoverOpen, isOpenFromVarKey: updateUserRoleSlideoverKey} = useIsOpenFromVar()
const {fromVar: updateUserPasswordId, isOpenFromVar: updateUserPasswordSlideoverOpen, isOpenFromVarKey: updateUserPasswordSlideoverKey} = useIsOpenFromVar()

const initialLoading = ref(false)

const paginator = new Paginator(new RequestDriver(userIndexRequest))

// Make the paginator prepare the first page
paginator.init(1, 10).then(() => {
    initialLoading.value = true
})

function loadUsers(page: Number = undefined) {
    page ? paginator.refresh(page): paginator.refresh()
}

const loadUsersDebounced = debounce(() => {
    loadUsers(1)
}, 250)
</script>