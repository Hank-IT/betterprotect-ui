import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface MilterCreatePayload {
    name: string,
    definition: string,
    description: string,
}

export class MilterCreateContent extends JsonContent {
    public constructor(data: MilterCreatePayload) {
        super(data)
    }
}

export class MilterCreateRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/milter'
    }

    public getResponse() {
        return new JsonResponse
    }
}