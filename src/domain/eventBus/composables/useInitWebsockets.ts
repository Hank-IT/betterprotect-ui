import EchoFactory from '@/domain/eventBus/EchoFactory'
import { useConfigStore } from '@/stores/config'

console.log("Initializing laravel-echo")

export default function initWebsockets() {
    const config = useConfigStore()

    window.echo = new EchoFactory(config.server, config.websocketKey).make()
}