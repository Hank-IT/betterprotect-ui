import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface UserRoleUpdatePayload {
    role: string,
}

export class UserRoleUpdatePayload extends JsonContent {
    public constructor(data: UserRoleUpdatePayload) {
        super(data)
    }
}

export class UserRoleUpdateRequest extends BaseRequest {
    protected id: Number


    method(): string {
        return 'PATCH'
    }

    url(): string {
        return `/api/v1/user/${this.id}/role`
    }

    public getResponse() {
        return new JsonResponse
    }

    public setId(id: number) {
        this.id = id

        return this
    }
}