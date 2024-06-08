import EchoEventBusChannel from '@js/notifications/contracts/EchoEventBusChannel'

export default class UserNotificationEventBus extends EchoEventBusChannel{

    public static readonly NAME: string = 'user-notifications'

    protected userId: string

    public constructor(userId: string) {
        super()
        this.userId = userId
    }

    public static getEventBusName(): string {
        return UserNotificationEventBus.NAME
    }

    public getEventBusName(): string {
        return UserNotificationEventBus.NAME
    }

    public getChannelName(): string {
        return `user.${this.userId}`
    }
}
