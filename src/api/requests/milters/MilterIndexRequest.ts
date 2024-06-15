import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface MilterResource {
    id: Number,
    name: string,
    definition: string,
    description: string,
    created_at: string,
    updated_at: string,
}

export class MilterIndexResponse extends JsonResponse  {
    public dataHandler(body): MilterResource[] {
        return body.data
    }
}

export class MilterIndexRequest extends BaseRequest  {
    method(): string {
        return 'GET'
    }

    url(): string {
        return '/api/v1/policy/milter'
    }

    public getResponse() {
        return new MilterIndexResponse
    }
}