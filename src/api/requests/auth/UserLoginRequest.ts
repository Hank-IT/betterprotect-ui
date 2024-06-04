import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface AuthPayload {
  username: string,
  password: string,
}

export class AuthJsonContent extends JsonContent {
  public constructor(protected data: AuthPayload) {}
}

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