import { BaseRequest, JsonResponse,  } from '@hank-it/ui/service/requests'
import type {RecipientResource} from '@/api/requests/recipients/RecipientIndexRequest'

export class PostfixLogDetailResponse extends JsonResponse  {
    public dataHandler(body) {
        return body.data
    }
}

export class PostfixLogDetailsRequest extends BaseRequest  {

    constructor(protected queueId: string) {
        super()
    }
    method(): string {
        return 'GET'
    }

    url(): string {
        return `/api/v1/postfix/log/${this.queueId}`
    }

    public getResponse() {
        return new PostfixLogDetailResponse
    }
}