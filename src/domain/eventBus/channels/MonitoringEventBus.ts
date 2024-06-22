import EchoEventBusChannel from '@/domain/eventBus/channels/EchoEventBusChannel'

export default class MonitoringEventBus extends EchoEventBusChannel {
  public static readonly NAME: string = 'MonitoringEventBus';

  public getEventBusName(): string {
    return MonitoringEventBus.NAME
  }

  public getChannelName(): string {
    return 'monitoring'
  }
}