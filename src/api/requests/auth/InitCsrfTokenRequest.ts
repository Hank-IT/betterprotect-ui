import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export class InitCsrfTokenRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/sanctum/csrf-cookie'
  }

  public getResponse() {
    return new JsonResponse
  }
}