import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface RuleCreatePayload {
    client_type: string,
    client_payload: string,
    sender_type: string,
    sender_payload: string,
    message: string,
    description: string,
    action: string,
}

export class RuleCreateContent extends JsonContent {
    public constructor(data: RuleCreatePayload) {
        super(data)
    }
}

export class RuleCreateRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/rules'
    }

    public getResponse() {
        return new JsonResponse
    }
}