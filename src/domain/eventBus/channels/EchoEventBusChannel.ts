export default abstract class EchoEventBusChannel {
  abstract getEventBusName(): string

  abstract getChannelName(): string;
}
