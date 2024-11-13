<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Đăng ký tài khoản mới
    public function register(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
            'username' => 'required|string|max:255', 
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',        // Phải có ít nhất 1 ký tự thường
                'regex:/[A-Z]/',        // Phải có ít nhất 1 ký tự hoa
                'regex:/[0-9]/'         // Phải có ít nhất 1 số
            ],
        ]);

        // Tạo người dùng mới với trạng thái "noactive"
        $user = User::create([
            'username' => $validatedData['username'], 
            'google_id'=>null,
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'otp' => null,
            'status' => 'noactive',  // Trạng thái ban đầu là "noactive"
        ]);

        // Tạo token cho người dùng sau khi đăng ký
        $token = $user->createToken('login_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'redirect' => '/login',
        ]);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        // Xác thực thông tin đăng nhập
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Tìm người dùng theo email
        $user = User::where('email', $credentials['email'])->first();

        // Kiểm tra thông tin đăng nhập
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
        }

        // Tạo token đăng nhập cho người dùng
        $token = $user->createToken('login_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'email' => $user->email // Include email in the response
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        // Xoá token hiện tại của người dùng
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}