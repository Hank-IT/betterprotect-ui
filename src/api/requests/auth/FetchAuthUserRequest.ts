import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'
import type { UserResource } from '@/api/requests/user/UserIndexRequest'

export class AuthUserResponse extends JsonResponse  {
  public dataHandler(body): UserResource[] {
    return body.data
  }
}

export class FetchAuthUserRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/api/v1/auth-user'
  }

  public getResponse() {
    return new AuthUserResponse
  }
}