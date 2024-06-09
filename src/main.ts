import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import {useAuthStore} from '@/stores/auth.ts'
import {FetchDriver, BaseRequest, VueLoaderDriverFactory, ErrorHandler} from '@hank-it/ui/service/requests'
import {Paginator, VuePaginationDriverFactory} from '@hank-it/ui/service/pagination'
import { FetchAuthUserRequest } from '@/api/requests/auth/FetchAuthUserRequest'
import { InitCsrfTokenRequest } from '@/api/requests/auth/InitCsrfTokenRequest'

BaseRequest.setRequestDriver(new FetchDriver({
    corsWithCredentials: true
}))
BaseRequest.setLoaderStateFactory(new VueLoaderDriverFactory)
Paginator.setViewDriverFactory(new VuePaginationDriverFactory)

const app = createApp(App)

app.use(createPinia())

const auth= useAuthStore()

router.beforeEach(async (to, from) => {
    if (!auth.authenticated && to.name !== 'login') {
        // redirect the user to the login page
        return { name: 'login' }
    }

    if (auth.authenticated && to.name === 'login') {
        return { name: 'dashboard' }
    }
})

ErrorHandler.registerHandler(error => {
    if (error.statusCode === 401) {
        console.debug("Caught UnauthorizedException")
        console.debug("Redirecting to login page")

        auth.authenticated = false

        router.push({ name: 'login' })
    }
})

const initLoad = async () => {
    try {
        const res = await fetch('/config.json')
        const file = (await res.json()) as Record<string, unknown>

        BaseRequest.setDefaultBaseUrl('https://' + file.servers[0])

        window.API_HOST = file.servers[0]

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
        //window.console.error(e)
        //router.push({ name: 'login' })
    }
}

initLoad().then(() => {
    app.use(router).mount('#app')
})