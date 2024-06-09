import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class ItemOrderRequest extends BaseRequest {
  constructor(protected entity: string, protected id: string, protected mode: string) {
    super()
  }

  method(): string {
    return 'PATCH'
  }

  url(): string {
    return `/api/v1/policy/order/${this.entity}/${this.id}/${this.mode}`
  }

  public getResponse() {
    return new PlainTextResponse
  }
}