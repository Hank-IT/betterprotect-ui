import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class ServerStateResponse extends JsonResponse {
  public dataHandler(body): Array {
    return body.data
  }
}

export class ServerStateRequest extends BaseRequest {
  constructor(protected id) {
    super()
  }

  method(): string {
    return 'GET'
  }

  url(): string {
    return `/api/v1/servers/${this.id}/state`
  }

  public getResponse() {
    return new ServerStateResponse
  }
}