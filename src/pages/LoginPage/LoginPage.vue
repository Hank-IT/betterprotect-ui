<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
        Betterprotect
      </a>
      <div
        class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Login
          </h1>
          <form @submit.prevent="submit" class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="username"
                     class="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input v-model="username" type="text" name="text" id="username"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                     placeholder="name@company.com" required="">
              <span class="text-red-600" v-if="formErrors?.username">{{ formErrors.username[0] }}</span>
            </div>
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input v-model="password" type="password" name="password" id="password"
                     placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                     required="">

            </div>
            <button type="submit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
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
import initWebsockets from '@/domain/eventBus/composables/useInitWebsockets'
import { useConfigStore } from '@/stores/config'

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
      auth.user = result.getData()

      const config = useConfigStore()

      initWebsockets(config.server, config.websocketKey)

      router.push({ name: 'server.index' })
    })
    .catch((error: RequestBaseException) => {
      error.getError().getBodyPromise().then(bodyContent => {
        formErrors.value = bodyContent.errors
      })
    })
}
</script>