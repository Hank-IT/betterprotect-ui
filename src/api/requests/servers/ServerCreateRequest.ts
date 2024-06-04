import { BaseRequest, JsonResponse, JsonContent } from '@hank-it/ui/service/requests'

export interface ServerCreatePayload {
  hostname: string,
  postfix_db_host: string,
  postfix_db_name: string,
  postfix_db_user: string,
  postfix_db_password: string,
  postfix_db_port: string,
  ssh_user: string,
  ssh_public_key: string,
  ssh_private_key: string,
  ssh_command_sudo: string,
  ssh_command_postqueue: string,
  ssh_command_postsuper: string,
  log_db_host: string,
  log_db_name: string,
  log_db_user: string,
  log_db_password: string,
  log_db_port: string,
}

export class ServerCreateContent extends JsonContent {
  public constructor(protected data: ServerCreatePayload) {}
}

export class ServerIndexRequest extends BaseRequest {
  method(): string {
    return 'POST'
  }

  url(): string {
    return '/api/v1/servers'
  }

  public getResponse() {
    return new JsonResponse
  }
}