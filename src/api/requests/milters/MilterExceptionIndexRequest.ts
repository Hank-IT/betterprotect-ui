import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'
import {type MilterResource} from '@/api/requests/milters/MilterIndexRequest'

export interface MilterExceptionResource {
    id: Number,
    client_type: string,
    client_payload: string,
    description: string,
    priority: string,
    active: string,
    created_at: string,
    updated_at: string,
    milters: MilterResource[],
}

export class MilterExceptionIndexResponse extends JsonResponse  {
    public dataHandler(body): MilterExceptionResource[] {
        return body.data
    }
}

export class MilterExceptionIndexRequest extends BaseRequest  {
    method(): string {
        return 'GET'
    }

    url(): string {
        return '/api/v1/policy/milter/exception'
    }

    public getResponse() {
        return new MilterExceptionIndexResponse
    }
}