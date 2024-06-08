import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class ServerDeleteRequest extends BaseRequest {
  constructor(protected id) {
    super()
  }

  method(): string {
    return 'DELETE'
  }

  url(): string {
    return `/api/v1/servers/${this.id}`
  }

  public getResponse() {
    return new PlainTextResponse
  }
}