import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'rdjhkf1ndhphxm6vzske',
    wsHost: "127.0.0.1",
    wsPort: "127.0.0.1" ?? 80,
    wssPort: "127.0.0.1" ?? 443,
    forceTLS: ('http' ?? 'https') === 'https',
    authEndpoint: "http://127.0.0.1:8000/api" + "/broadcasting/auth",
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token")
        },
    },
});