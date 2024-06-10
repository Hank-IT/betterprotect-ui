import { BaseRequest, JsonResponse, type PaginatableRequest, type ResponseContract } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface RecipientResource {
  id: Number,
  action: string,
  active: Boolean,
  client_type: string,
  client_payload: string,
  sender_type: string,
  sender_payload: string,
  priority: Number,
  message: string,
  description: string,
  created_at: string,
}

export class RecipientIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): RecipientResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class RecipientIndexRequest extends BaseRequest implements PaginatableRequest  {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/policy/recipients'
  }

  public getResponse() {
    return new RecipientIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}