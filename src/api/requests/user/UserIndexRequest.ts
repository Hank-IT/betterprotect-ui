import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface UserResource {
  id: Number,
  username: string,
  role: string,
}

export class UserIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): UserResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class UserIndexRequest extends BaseRequest implements PaginatableRequest  {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/user'
  }

  public getResponse() {
    return new UserIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}