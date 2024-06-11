import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface TransportResource {
  id: number,
  domain: string,
  transport: string,
  nexthop: string,
  nexthop_port: number,
  nexthop_type: string,
  nexthop_mx: boolean,
  created_at: string,
  data_source: string,
  active: boolean,
}

export class TransportIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): TransportResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class TransportIndexRequest extends BaseRequest implements PaginatableRequest  {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/policy/transports'
  }

  public getResponse() {
    return new TransportIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}