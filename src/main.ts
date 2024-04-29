import './assets/main.css'
import 'flowbite'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {useAuthStore} from '@/stores/auth.ts'
import {FetchDriver, BaseRequest, VueLoaderDriverFactory} from '@hank-it/ui/service/requests'
import {VuePaginationDriverFactory} from '@hank-it/ui/service/pagination'
import {UnauthorizedException, PageExpiredException} from '@hank-it/ui/service/requests/exceptions'
import { FetchAuthUserRequest } from '@/api/requests/auth/FetchAuthUserRequest'
import { InitCsrfTokenRequest } from '@/api/requests/auth/InitCsrfTokenRequest'

BaseRequest.setRequestDriver(new FetchDriver({
    corsWithCredentials: true
}))
BaseRequest.setLoaderStateFactory(new VueLoaderDriverFactory)
Paginator.setViewDriverFactory(new VuePaginationDriverFactory)

const app = createApp(App)

app.use(createPinia())

const auth = useAuthStore()

router.beforeEach(async (to, from) => {
    if (!auth.authenticated && to.name !== 'login') {
        // redirect the user to the login page
        return { name: 'login' }
    }

    if (auth.authenticated && to.name === 'login') {
        return { name: 'dashboard' }
    }
})

const initLoad = async () => {
    try {
        const res = await fetch('/config.json')
        const file = (await res.json()) as Record<string, unknown>

        window.SERVER = file.servers[0]

        window.console.debug('Loaded config.json')
    } catch (e) {
        window.console.error('Failed to load config.json')
        window.console.error(e)
    }

    window.console.debug('Initializing CSRF support')

    await new InitCsrfTokenRequest().send()

    try {
        await new FetchAuthUserRequest().send()

        auth.authenticated = true
    } catch(e) {
        // We have to catch the error and redirect to the login page
        // ourselves here instead of relying on the global error
        // handler, since otherwise the app does not boot.
        window.console.error(e)
        router.push({ name: 'login' })
    }
}

initLoad().then(() => {
    app.use(router).mount('#app')
})