import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface RuleResource {
  id: Number,
  action: string,
  active: Boolean,
  client_type: string,
  client_payload: string,
  sender_type: string,
  sender_payload: string,
  priority: Number,
  message: string,
  description: string,
  created_at: string,
}

export class RuleIndexResponse extends JsonResponse {
  public dataHandler(body): RuleResource[] {
    return body.data
  }
}

export class RuleIndexRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/policy/rules'
  }

  public getResponse() {
    return new RuleIndexResponse
  }
}