import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface ServerPolicyInstallationPayload {
  server_id: Number[],
}

export class ServerPolicyInstallationContent extends JsonContent {
  public constructor(data: ServerPolicyInstallationPayload) {
    super(data)
  }
}

export class ServerPolicyInstallationRequest extends BaseRequest {
  method(): string {
    return 'POST'
  }

  url(): string {
    return '/api/v1/policy/installation'
  }

  public getResponse() {
    return new JsonResponse
  }
}