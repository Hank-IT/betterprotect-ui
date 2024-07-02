import { BaseRequest, JsonResponse, type PaginatableRequest, type ResponseContract } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface PostfixLogResource {
    id: Number,
}

export class PostfixLogResponse extends JsonResponse implements PaginationResponseContract  {
    public dataHandler(body): PostfixLogResource[] {
        return body.data
    }

    public getTotal(): number {
        return this.body.meta.total
    }
}

export class PostfixLogRequeest extends BaseRequest implements PaginatableRequest  {
    method(): string {
        return 'GET'
    }

    url(): string {
        return '/api/v1/postfix/log'
    }

    public getResponse() {
        return new PostfixLogResponse
    }

    public setPaginationParams(page: number, size: number): BaseRequest {
        return this.withParams({
            page_number: page,
            page_size: size,
        })
    }
}