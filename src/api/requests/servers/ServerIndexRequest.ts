import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface ServerResource {
  id: string,
  hostname: string,
  last_policy_install: string,
}

export class ServerIndexResponse extends JsonResponse {
  public dataHandler(body): ServerResource[] {
    return body.data
  }
}

export class ServerIndexRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/servers'
  }

  public getResponse() {
    return new ServerIndexResponse
  }
}