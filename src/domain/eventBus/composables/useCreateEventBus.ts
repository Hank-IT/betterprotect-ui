import { onBeforeUnmount, provide } from 'vue'
import EventBus from '../EventBus'

export default function useCreateEventBus(eventBus: EventBus, name: string = 'event-listener'): EventBus {
    provide<EventBus>(name, eventBus)

    onBeforeUnmount(() => {
        eventBus.stop()
    })

    return eventBus
}
