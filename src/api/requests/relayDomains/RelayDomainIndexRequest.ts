import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface RelayDomainResource {
  id: number,
  domain: string,
}

export class RelayDomainIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): RelayDomainResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class RelayDomainIndexRequest extends BaseRequest implements PaginatableRequest  {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/policy/relay-domain'
  }

  public getResponse() {
    return new RelayDomainIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}