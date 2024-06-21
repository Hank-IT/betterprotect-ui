import useCreateEventBus from '@/domain/eventBus/composables/useCreateEventBus'
import LaravelEchoEventBus from '@/domain/eventBus/LaravelEchoEventBus'
import type EchoEventBusChannel from '@/domain/eventBus/channels/EchoEventBusChannel'

export default function useCreateEchoEventBus(echoEventBusChannel: EchoEventBusChannel): LaravelEchoEventBus {

    const eventBus = new LaravelEchoEventBus(window.echo, echoEventBusChannel.getChannelName())

    useCreateEventBus(
        eventBus,
        echoEventBusChannel.getEventBusName(),
    )

    eventBus.start()

    return eventBus
}
