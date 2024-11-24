<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('room-messages', function ($user) {
    // Đảm bảo chỉ cho phép người dùng đã đăng nhập
    return $user !== null; 
});


