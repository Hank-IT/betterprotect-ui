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
import EchoFactory from '@/domain/eventBus/EchoFactory'
import Pusher from 'pusher-js'

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

function initWebsockets(url: string, websocketAppKey: string) {
    // Setup websockets
    window.Pusher = Pusher
    window.echo = new EchoFactory(url, websocketAppKey).make()

    window.echo.private('task')
      .listen('TaskCreated', (e) => {
          console.log(e);
      });
}

const initLoad = async () => {
    let file

    try {
        const res = await fetch('/config.json')
        file = (await res.json()) as Record<string, unknown>

        BaseRequest.setDefaultBaseUrl('https://' + file.servers[0])

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

        initWebsockets(file.servers[0], file.websockets.key)

    } catch(e) {
        console.error(e)

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