export default interface EventBusEventContract {
    match(eventPayload: any): boolean

    name(): string
}

export type {
    EventBusEventContract,
}
