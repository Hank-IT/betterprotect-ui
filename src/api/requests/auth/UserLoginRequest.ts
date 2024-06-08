import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface AuthPayload {
  username: string,
  password: string,
}

export class AuthJsonContent extends JsonContent {
  public constructor(data: AuthPayload){
    super(data)
  }
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