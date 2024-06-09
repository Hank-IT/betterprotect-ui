import { BaseRequest, PlainTextResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface ActivationPayload {
  state: boolean
}

export class ActivationContent extends JsonContent {
  public constructor(data: ActivationPayload) {
    super(data)
  }
}

export class ActivationRequest extends BaseRequest {
  constructor(protected entity: string, protected id: string) {
    super()
  }

  method(): string {
    return 'PATCH'
  }

  url(): string {
    return `/api/v1/policy/activation/${this.entity}/${this.id}`
  }

  public getResponse() {
    return new PlainTextResponse
  }
}