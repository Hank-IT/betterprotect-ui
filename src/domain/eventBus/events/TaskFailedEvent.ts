import type EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract'

export default class TaskFailedEvent implements EventBusEventContract {
    public match(eventPayload: any): boolean {
        return true
    }

    public name(): string {
        return '.task.failed'
    }
}