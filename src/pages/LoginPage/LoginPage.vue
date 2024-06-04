<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Betterprotect
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login
          </h1>
          <form @submit.prevent="submit" class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="username"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input v-model="username" type="text" name="text" id="username"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name@company.com" required="">
              <span class="text-red-600" v-if="formErrors?.username">{{ formErrors.username[0] }}</span>
            </div>
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input v-model="password" type="password" name="password" id="password"
                     placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required="">

            </div>
            <button type="submit"
                    class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FetchAuthUserRequest } from '@/api/requests/auth/FetchAuthUserRequest'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { AuthJsonContent, UserLoginRequest } from '@/api/requests/auth/UserLoginRequest'
import { RequestBaseException } from '@hank-it/ui/service/requests/exceptions'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const formErrors = ref({})

function submit() {
  new UserLoginRequest()
    .setBody(new AuthJsonContent({
      username: username.value,
      password: password.value
    }))
    .send()
    .then(() => {
      return new FetchAuthUserRequest().send()
    })
    .then(result => {
      auth.authenticated = true

      router.push({ name: 'dashboard' })
    })
    .catch((error: RequestBaseException) => {
      error.getError().getBodyPromise().then(bodyContent => {
        formErrors.value = bodyContent.errors
      })
    })
}
</script>