import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface RelayDomainCreatePayload {
    domain: string,
}

export class RelayDomainCreateContent extends JsonContent {
    public constructor(data: RelayDomainCreatePayload) {
        super(data)
    }
}

export class RelayDomainCreatRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/relay-domain'
    }

    public getResponse() {
        return new JsonResponse
    }
}