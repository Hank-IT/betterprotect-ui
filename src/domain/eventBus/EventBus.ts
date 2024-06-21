import EventBusSubscriber from './EventBusSubscriber'
import type EventBusEventContract from './contracts/EventBusEventContract'

export default abstract class EventBus {
    protected subscribers: EventBusSubscriber[] = []

    public emit(eventName: string, payload?: any): void {
        this.subscribers.forEach((subscriber: EventBusSubscriber) => {

            subscriber.getEvents().forEach((event: EventBusEventContract) => {
                if (event.name() === eventName && event.match(payload)) {
                    subscriber.invoke(event, payload)
                }
            })
        })
    }

    public addSubscriber(subscriber: EventBusSubscriber): void {
        this.subscribers.push(subscriber)
    }

    public removeSubscriber(subscriber: EventBusSubscriber): void {
        this.subscribers = this.subscribers.filter((s: EventBusSubscriber) => {
            return subscriber.getId() !== s.getId()
        })
    }

    public abstract stop(): void

    public abstract start(): void
}
