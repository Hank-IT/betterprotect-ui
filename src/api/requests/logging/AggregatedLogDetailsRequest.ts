import { BaseRequest, JsonResponse,  } from '@hank-it/ui/service/requests'

export class AggregatedLogDetailsResponse extends JsonResponse  {
    public dataHandler(body) {
        return body.data
    }
}

export class AggregatedLogDetailsRequest extends BaseRequest  {

    constructor(protected queueId: string) {
        super()
    }
    method(): string {
        return 'GET'
    }

    url(): string {
        return `/api/v1/logging/aggregated/${this.queueId}`
    }

    public getResponse() {
        return new AggregatedLogDetailsResponse
    }
}