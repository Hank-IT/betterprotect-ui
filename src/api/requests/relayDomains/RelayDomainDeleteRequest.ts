import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'

export class RelayDomainDeleteRequest extends BaseRequest {
    constructor(protected id: number) {
        super()
    }

    method(): string {
        return 'DELETE'
    }

    url(): string {
        return `/api/v1/policy/relay-domain/${this.id}`
    }

    public getResponse() {
        return new PlainTextResponse
    }
}