import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Đảm bảo bạn đã cấu hình đúng thông tin từ Laravel (key, cluster, etc.)
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: "pusher",
    key: "e4eabd0294a831ed2a68", // Thay bằng Pusher key của bạn
    cluster: "ap1", // Thay bằng cluster của bạn (vd: ap1)
    forceTLS: true, // Bật HTTPS
});

export default echo;