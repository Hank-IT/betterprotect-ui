import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface TaskRunningResource {
  count: Number
}

export class TaskRunningResponse extends JsonResponse  {
  public dataHandler(body): TaskRunningResource[] {
    return body.data
  }
}

export class TaskRunningRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/tasks/running'
  }

  public getResponse() {
    return new TaskRunningResponse
  }
}