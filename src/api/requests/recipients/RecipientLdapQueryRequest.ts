import { BaseRequest, PlainTextResponse } from '@hank-it/ui/service/requests'


export class RecipientLdapQueryRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/policy/recipients/ldap'
    }

    public getResponse() {
        return new PlainTextResponse
    }
}