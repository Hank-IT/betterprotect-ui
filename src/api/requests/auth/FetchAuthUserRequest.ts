import { BaseRequest, type ResponseContract, JsonResponse } from '@hank-it/ui/service/requests'

export class FetchAuthUserRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/user'
  }
}