import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class UserLogoutRequest extends BaseRequest {
  method(): string {
    return 'POST'
  }

  url(): string {
    return '/api/v1/logout'
  }

  public getResponse() {
    return new JsonResponse
  }
}