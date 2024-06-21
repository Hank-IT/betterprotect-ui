import type EventBusEventContract from '@/domain/eventBus/contracts/EventBusEventContract'

export default class TaskProgressEvent implements EventBusEventContract {
    public match(eventPayload: any): boolean {
        return true
    }

    public name(): string {
        return '.task.progress'
    }
}