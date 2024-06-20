import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface UserRolePasswordPayload {
    password: string,
    password_confirmation: string,
}

export class UserRolePasswordPayload extends JsonContent {
    public constructor(data: UserRolePasswordPayload) {
        super(data)
    }
}

export class UserPasswordUpdateRequest extends BaseRequest {
    protected id: Number

    method(): string {
        return 'PATCH'
    }

    url(): string {
        return `/api/v1/user/${this.id}/password`
    }

    public getResponse() {
        return new JsonResponse
    }

    public setId(id: number) {
        this.id = id

        return this
    }
}