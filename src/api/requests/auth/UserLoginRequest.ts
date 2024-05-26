import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class UserLoginRequest extends BaseRequest {
  method(): string {
    return 'POST'
  }

  url(): string {
    return '/api/v1/login'
  }

  public getResponse() {
    return new JsonResponse
  }
}