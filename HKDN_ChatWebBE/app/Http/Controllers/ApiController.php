<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Kiểm tra trực tiếp với email và password mẫu
        if ($credentials['email'] === 'admin@gmail.com' && $credentials['password'] === 'Tayeunang123') {
            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'user' => [
                    'name' => 'Admin',
                    'email' => 'admin@gmail.com',
                    'role' => 'admin'
                ]
            ]);
        } else {
            // Nếu đăng nhập thất bại
            return response()->json([
                'success' => false,
                'message' => 'Sai email hoặc mật khẩu',
            ], 401);
        }
    }
}