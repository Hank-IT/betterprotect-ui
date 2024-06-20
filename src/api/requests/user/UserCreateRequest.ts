import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface UserCreatePayload {
    username: string,
    password: string,
    password_confirmation: string,
    role: string,
}

export class UserCreateContent extends JsonContent {
    public constructor(data: UserCreatePayload) {
        super(data)
    }
}

export class UserCreateRequest extends BaseRequest {
    method(): string {
        return 'POST'
    }

    url(): string {
        return '/api/v1/user'
    }

    public getResponse() {
        return new JsonResponse
    }
}