import EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract.ts'
import EventBusSubscriber from '@/domain/eventBus/EventBusSubscriber.ts'
import Echo from 'laravel-echo'
import { Channel } from 'laravel-echo/src/channel'
import EchoEventBusChannel from '@js/notifications/contracts/EchoEventBusChannel'
import EventBus from '@/domain/eventBus/EventBus.ts'

export default class LaravelEchoEventBus extends EventBus {
    protected echo: Echo
    protected channelName: string
    protected channel: Channel
    protected events: EventBusEventContract[] = []

    public constructor(
        echo: Echo,
        channel: string,
    ) {
        super()
        this.echo = echo
        this.channelName = channel
    }

    public start(): void {
        if (this.channel !== undefined) {
            throw new Error(`Already started listening to ${this.channelName}`)
        }

        this.channel = this.echo.private(this.channelName)

        this.events.forEach(event => this.listenForEvent(event))
    }

    public stop(): void {
        if (this.channel === undefined) {
            throw new Error(`Not listening on channel ${this.channelName}`)
        }

        this.echo.leave(this.channelName)
        this.channel = undefined
    }

    public addSubscriber(subscriber: EventBusSubscriber) {
        super.addSubscriber(subscriber)
        // start listening for each event
        subscriber.getEvents().forEach(event => this.startListening(event))
    }

    public removeSubscriber(subscriber: EventBusSubscriber) {
        super.removeSubscriber(subscriber)

        subscriber.getEvents().forEach(event => {
            // check if another subscriber is listening for the same event
            if (this.isAnySubscriberListeningForEvent(event)) {
                return
            }

            this.stopListening(event)
        })
    }

    /**
     * Test if any of the subscribers listens for the event
     */
    protected isAnySubscriberListeningForEvent(event: EventBusEventContract): boolean {
        return this.subscribers.find(s => s.getEvents().find(e => e.name() === event.name())) === undefined
    }

    protected listenForEvent(event: EventBusEventContract): void {
        this.channel?.listen(
            event.name(),
            (payload: any) => this.emit(event.name(), payload),
        )
    }

    protected startListening(event: EventBusEventContract): void {
        if (this.isListeningForEvent(event)) {
            return
        }

        this.events.push(event)
        this.listenForEvent(event)
    }

    protected stopListening(event: EventBusEventContract): void {
        if (!this.isListeningForEvent(event)) {
            return
        }

        this.channel?.stopListening(event.name())

        this.events = this.events.filter(e => e.name() !== event.name())
    }

    public switchChannel(channel: EchoEventBusChannel): void {
        this.stop()
        this.channelName = channel.getChannelName()
        this.start()
    }

    protected isListeningForEvent(event: EventBusEventContract) {
        return this.events.find(e => e.name() === event.name())
    }
}
