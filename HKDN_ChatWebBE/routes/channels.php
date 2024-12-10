<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('room-messages', function ($user) {
    // Đảm bảo chỉ cho phép người dùng đã đăng nhập
    return $user !== null; 
});

Broadcast::channel('message-channel', function ($user) {
    return true;  // Cho phép mọi người nghe kênh này (có thể tùy chỉnh thêm)
});


Broadcast::channel('room.{roomId}', function ($user, $roomId) {
    return true; // Xác thực quyền tham gia
});

Broadcast::channel('chat', function ($user) {
    // Chỉ cho phép user đã đăng nhập truy cập kênh
    return $user !== null;
});


