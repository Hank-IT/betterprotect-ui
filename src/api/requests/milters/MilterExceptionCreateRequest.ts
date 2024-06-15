import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface MilterExceptionCreatePayload {
    client_type: string,
    client_payload: string,
    milter_id: Number[],
    description: string,
}

export class MilterExceptionCreateContent extends JsonContent {
    public constructor(data: MilterExceptionCreatePayload) {
        super(data)
    }
}

export class MilterExceptionCreateRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/milter/exception'
    }

    public getResponse() {
        return new JsonResponse
    }
}