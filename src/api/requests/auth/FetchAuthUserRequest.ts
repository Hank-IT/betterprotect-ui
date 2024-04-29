import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class FetchAuthUserRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/auth/user'
  }

  public getResponse() {
    return new JsonResponse
  }
}