import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class ServerQueueFlushRequest extends BaseRequest {
    constructor(protected id: Number) {
        super()
    }

    method(): string {
        return 'POST'
    }

    url(): string {
        return `/api/v1/servers/${this.id}/postfix-queue`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}