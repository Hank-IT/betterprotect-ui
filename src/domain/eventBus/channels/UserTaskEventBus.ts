import EchoEventBusChannel from '@/domain/eventBus/channels/EchoEventBusChannel'

export default class UserTaskEventBus extends EchoEventBusChannel {
  public static readonly NAME: string = 'UserTaskEventBus';

  public getEventBusName(): string {
    return UserTaskEventBus.NAME
  }

  public getChannelName(): string {
    return 'task'
  }
}