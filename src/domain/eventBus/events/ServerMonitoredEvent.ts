import type EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract'

export default class ServerMonitoredEvent implements EventBusEventContract {
    public match(eventPayload: any): boolean {
        return true
    }

    public name(): string {
        return '.server.monitored'
    }
}