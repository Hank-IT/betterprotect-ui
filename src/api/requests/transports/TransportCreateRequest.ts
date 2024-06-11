import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface TransportCreatePayload {
    domain: string,
    transport: string,
    nexthop_type: string,
    nexthop: string,
    nexthop_port: Number,
    nexthop_mx: boolean,
}

export class TransportCreateContent extends JsonContent {
    public constructor(data: TransportCreatePayload) {
        super(data)
    }
}

export class TransportCreatRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/transports'
    }

    public getResponse() {
        return new JsonResponse
    }
}