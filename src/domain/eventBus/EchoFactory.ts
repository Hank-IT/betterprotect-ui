import Echo from 'laravel-echo'

export default class EchoFactory {
  constructor(protected host: string, protected websocketAppKey: string) {}

  public make() {
    // Workaround to make pusher send credentials
    window.Pusher.Runtime.createXHR = function () {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      return xhr;
    };

    return new Echo({
      broadcaster: 'pusher',
      key: this.websocketAppKey,
      wsHost: this.host,
      wssHost: this.host,
      wsPath: '/ws',
      forceTLS: true,
      encrypted: true,
      disableStats: true,
      wsPort: 80,
      wssPort: 443,
      authEndpoint: 'https://' + this.host + '/api/broadcasting/auth',
      enabledTransports: ['ws', 'wss'],
      cluster: 'eu',
      auth: {
        headers: {
          'X-XSRF-TOKEN': this.getCookie('XSRF-TOKEN'),
          'Accept': 'application/json'
        }
      },
    })
  }

  protected getCookie(cname) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }
}