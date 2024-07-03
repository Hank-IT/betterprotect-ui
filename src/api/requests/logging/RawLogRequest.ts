import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface RawLogResource {
    id: Number,
}

export class RawLogResponse extends JsonResponse implements PaginationResponseContract  {
    public dataHandler(body): RawLogResource[] {
        return body.data
    }

    public getTotal(): number {
        return this.body.meta.total
    }
}

export class RawLogRequest extends BaseRequest implements PaginatableRequest  {
    method(): string {
        return 'GET'
    }

    url(): string {
        return '/api/v1/logging/raw'
    }

    public getResponse() {
        return new RawLogResponse
    }

    public setPaginationParams(page: number, size: number): BaseRequest {
        return this.withParams({
            page_number: page,
            page_size: size,
        })
    }
}