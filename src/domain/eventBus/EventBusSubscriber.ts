import type EventBusEventContract from './contracts/EventBusEventContract'

export default class EventBusSubscriber {
    protected id: string
    protected events: EventBusEventContract[]
    protected callback: (event: EventBusEventContract, payload?: any) => void

    public constructor(
        events: EventBusEventContract|EventBusEventContract[],
        callback: (event: EventBusEventContract, payload?: any) => void,
    ) {
        this.id = Symbol()
        this.callback = callback

        if (!Array.isArray(events)) {
            events = [events]
        }

        this.events = events
    }

    public invoke(event: EventBusEventContract, payload?: any): void {
        this.callback(event, payload)
    }

    public getId(): string {
        return this.id
    }

    public getEvents(): EventBusEventContract[] {
        return this.events
    }
}
