import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class UserDeleteRequest extends BaseRequest {
    constructor(protected id: Number) {
        super()
    }

    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/user/${this.id}`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}