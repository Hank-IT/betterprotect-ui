import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface ServerQueueIndexResource {
  id: Number,

}

export class ServerQueueIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): ServerQueueIndexResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class ServerQueueIndexRequest extends BaseRequest implements PaginatableRequest  {
  constructor(protected id: Number) {
    super()
  }

  method(): string {
    return 'GET'
  }

  url(): string {
    return `/api/v1/servers/${this.id}/postfix-queue`
  }

  public getResponse() {
    return new ServerQueueIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}