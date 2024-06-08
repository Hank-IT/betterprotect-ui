import { BaseRequest, JsonResponse } from '@hank-it/ui/service/requests'

export interface ServerResource {
  hostname: '',
  postfix_db_host: '',
  postfix_db_name: '',
  postfix_db_user: '',
  postfix_db_port: '',
  ssh_user: '',
  ssh_public_key: '',
  ssh_command_sudo: '',
  ssh_command_postqueue: '',
  ssh_command_postsuper: '',
  log_db_host: '',
  log_db_name: '',
  log_db_user: '',
  log_db_port: '',
}

export class ServerShowResponse extends JsonResponse {
  public dataHandler(body): ServerResource[] {
    return body.data
  }
}

export class ServerShowRequest extends BaseRequest {
  constructor(protected id) {
    super()
  }

  method(): string {
    return 'GET'
  }

  url(): string {
    return `/api/v1/servers/${this.id}`
  }

  public getResponse() {
    return new ServerShowResponse
  }
}