import { inject, onBeforeUnmount } from 'vue'
import EventBusSubscriber from '../EventBusSubscriber'
import EventBus from '../EventBus'

export default function useListenForEventsOnBus(
    subscriptions: EventBusSubscriber[],
    eventBusName: string|EventBus = 'event-listener',
): void {

    let eventBus: EventBus

    if (typeof eventBusName === 'string' || eventBus instanceof String) {
        // @ts-ignore it is a string
        eventBus = inject<EventBus>(eventBusName)
    } else {
        eventBus = eventBusName
    }

    subscriptions.forEach((subscription: EventBusSubscriber): void => {
        eventBus.addSubscriber(subscription)
    })

    onBeforeUnmount((): void => {
        subscriptions.forEach((subscription: EventBusSubscriber): void => {
            eventBus?.removeSubscriber(subscription)
        })
    })
}
