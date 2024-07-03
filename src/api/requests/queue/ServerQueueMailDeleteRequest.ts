import { BaseRequest, PlainTextResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface ServerQueueMailDeletePayload {
    queue_id: Array,
}

export class ServerQueueMailDeleteContent extends JsonContent {
    public constructor(data: ServerQueueMailDeletePayload) {
        super(data)
    }
}

export class ServerQueueMailDeleteRequest extends BaseRequest {
    constructor(protected id: Number) {
        super()
    }

    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/servers/${this.id}/postfix-queue`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}