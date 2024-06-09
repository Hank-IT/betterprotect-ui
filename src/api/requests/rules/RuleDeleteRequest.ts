import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class RuleDeleteRequest extends BaseRequest {
    constructor(protected id: string) {
        super()
    }

    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/policy/rules/${this.id}`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}