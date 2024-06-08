import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class ServerQueueCountResponse extends JsonResponse {
  public dataHandler(body): Array {
    return body.data
  }
}

export class ServerQueueCountRequest extends BaseRequest {
  constructor(protected id) {
    super()
  }

  method(): string {
    return 'GET'
  }

  url(): string {
    return `/api/v1/servers/${this.id}/postfix-queue/count`
  }

  public getResponse() {
    return new ServerQueueCountResponse
  }
}