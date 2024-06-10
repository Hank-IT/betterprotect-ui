import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface RecipientCreatePayload {
    payload: string,
}

export class RecipientCreateContent extends JsonContent {
    public constructor(data: RecipientCreatePayload) {
        super(data)
    }
}

export class RecipientCreateRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/recipients'
    }

    public getResponse() {
        return new JsonResponse
    }
}