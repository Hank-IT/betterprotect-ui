import { BaseRequest, PlainTextResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface RecipientDeletePayload {
    ids: Array,
}

export class RecipientDeleteContent extends JsonContent {
    public constructor(data: RecipientDeletePayload) {
        super(data)
    }
}

export class RecipientDeleteRequest extends BaseRequest {
    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/policy/recipients`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}