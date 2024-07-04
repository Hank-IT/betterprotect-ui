import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class ServerQueueRefreshRequest extends BaseRequest {
    constructor(protected id: Number) {
        super()
    }

    method(): string {
        return 'POST'
    }

    url(): string {
        return `/api/v1/servers/${this.id}/postfix-queue/refresh`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}