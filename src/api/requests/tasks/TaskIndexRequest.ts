import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

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

export class TaskIndexResponse extends JsonResponse {
  public dataHandler(body): TaskResource[] {
    return body.data
  }
}

export class TaskIndexRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    // ToDo
    return '/api/v1/tasks?page_number=1&page_size=10'
  }

  public getResponse() {
    return new TaskIndexResponse
  }
}