import { BaseRequest, JsonResponse, type PaginatableRequest, type ResponseContract } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface AggregatedLogResource {
    id: Number,
}

export class AggregatedLogResponse extends JsonResponse implements PaginationResponseContract  {
    public dataHandler(body): AggregatedLogResource[] {
        return body.data
    }

    public getTotal(): number {
        return this.body.meta.total
    }
}

export class AggregatedLogRequest extends BaseRequest implements PaginatableRequest  {
    method(): string {
        return 'GET'
    }

    url(): string {
        return '/api/v1/logging/aggregated'
    }

    public getResponse() {
        return new AggregatedLogResponse
    }

    public setPaginationParams(page: number, size: number): BaseRequest {
        return this.withParams({
            page_number: page,
            page_size: size,
        })
    }
}