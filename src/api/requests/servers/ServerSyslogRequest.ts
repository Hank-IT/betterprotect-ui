import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface ServerSyslogResource {
    id: Number,
}

export class ServerSyslogResponse extends JsonResponse implements PaginationResponseContract  {
    public dataHandler(body): ServerSyslogResource[] {
        return body.data
    }

    public getTotal(): number {
        return this.body.meta.total
    }
}

export class ServerSyslogRequest extends BaseRequest implements PaginatableRequest  {
    constructor(protected id) {
        super()
    }

    method(): string {
        return 'GET'
    }

    url(): string {
        return `/api/v1/servers/${this.id}/log`
    }

    public getResponse() {
        return new ServerSyslogResponse
    }

    public setPaginationParams(page: number, size: number): BaseRequest {
        return this.withParams({
            page_number: page,
            page_size: size,
        })
    }
}