import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

console.log("Initializing laravel-echo")

window.Pusher = Pusher

function getCookie(cname) {
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

const echo = new Echo({
    broadcaster: 'pusher',
    key: getCookie('websocket-app-key'),
    wsHost: window.API_HOST + '/ws',
    wssHost: window.API_HOST + '/ws',
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    wsPort: 80,
    wssPort: 443,
    authEndpoint: '/api/broadcasting/auth',
    enabledTransports: ['ws', 'wss'],
    cluster: 'eu',
    auth: {
        headers: {
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        },
    },
})

export function useEcho() {
    return echo
}