import { useEcho } from '@js/composables/useEcho'
import LaravelEchoEventBus from '@js/services/LaravelEchoEventBus'
import EchoEventBusChannel from '@js/notifications/contracts/EchoEventBusChannel'
import useCreateEventBus from '@/domain/eventBus/composables/useCreateEventBus'

export default function useCreateEchoEventBus(echoEventBusChannel: EchoEventBusChannel): LaravelEchoEventBus {

    const eventBus = new LaravelEchoEventBus(useEcho(), echoEventBusChannel.getChannelName())

    useCreateEventBus(
        eventBus,
        echoEventBusChannel.getEventBusName(),
    )

    eventBus.start()

    return eventBus
}
