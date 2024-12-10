import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REACT_APP_REVERB_APP_KEY,
    wsHost: process.env.REACT_APP_REVERB_HOST,
    wsPort: process.env.REACT_APP_REVERB_PORT ?? 80,
    wssPort: process.env.REACT_APP_REVERB_PORT ?? 443,
    forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? 'https') === 'https',
    authEndpoint: process.env.REACT_APP_API_PATH + "/broadcasting/auth",
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token")
        },
    },
});