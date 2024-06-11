import { BaseRequest, PlainTextResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface TransportDeletePayload {
    ids: Array,
}

export class TransportDeleteContent extends JsonContent {
    public constructor(data: TransportDeletePayload) {
        super(data)
    }
}

export class TransportDeleteRequest extends BaseRequest {
    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/policy/transports`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}