import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {ServerQueueIndexResource} from '@/api/requests/queue/ServerQueueIndexRequest'

export class ServerQueueMailResponse extends JsonResponse  {
  public dataHandler(body): ServerQueueIndexResource {
    return body.data
  }
}

export class ServerQueueMailRequest extends BaseRequest implements PaginatableRequest  {
  constructor(protected serverId: Number, protected queueId: string) {
    super()
  }

  method(): string {
    return 'GET'
  }

  url(): string {
    return `/api/v1/servers/${this.serverId}/postfix-queue/${this.queueId}`
  }

  public getResponse() {
    return new ServerQueueMailResponse
  }
}