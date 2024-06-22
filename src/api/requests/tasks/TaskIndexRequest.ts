import { BaseRequest, JsonResponse, type PaginatableRequest } from '@hank-it/ui/service/requests'
import type {PaginationResponseContract} from '@hank-it/ui/service/pagination'

export interface TaskProgressResource {
  id: string,
  description: string,
  created_at: string,
  updated_at: string,
}

export interface TaskResource {
  id: string,
  username: string,
  task: string,
  started_at: string,
  ended_at: string,
  progress: TaskProgressResource[],
  status: string,
  created_at: string,
  updated_at: string,
}

export class TaskIndexResponse extends JsonResponse implements PaginationResponseContract  {
  public dataHandler(body): TaskResource[] {
    return body.data
  }

  public getTotal(): number {
    return this.body.meta.total
  }
}

export class TaskIndexRequest extends BaseRequest implements PaginatableRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/tasks'
  }

  public getResponse() {
    return new TaskIndexResponse
  }

  public setPaginationParams(page: number, size: number): BaseRequest {
    return this.withParams({
      page_number: page,
      page_size: size,
    })
  }
}