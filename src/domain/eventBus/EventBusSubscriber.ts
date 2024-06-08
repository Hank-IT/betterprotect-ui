import EventBusEventContract from './contracts/EventBusEventContract'
import { uuidv4 } from '../..'

export default class EventBusSubscriber {
    protected id: string
    protected events: EventBusEventContract[]
    protected callback: (event: EventBusEventContract, payload?: any) => void

    public constructor(
        events: EventBusEventContract|EventBusEventContract[],
        callback: (event: EventBusEventContract, payload?: any) => void,
    ) {
        this.id = uuidv4()
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
