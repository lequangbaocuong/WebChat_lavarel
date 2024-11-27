<?php

namespace App\Http\Controllers;

use App\Mail\VerificationCodeMail;
use Illuminate\Http\JsonResponse;
use GuzzleHttp\Exception\ClientException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use App\Models\User;
use App\Models\Role;
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

        if ($user && $user->status === 'noactive') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản chưa được xác thực. ',
                'email' => $user->email // Bao gồm email để client xử lý tiếp
            ], 403); // Mã HTTP 403: Forbidden
        }

        // Kiểm tra thông tin đăng nhập
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng.'
            ], 401);
        }

        // Tạo token đăng nhập cho người dùng
        $token = $user->createToken('login_token')->plainTextToken;
       
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'email' => $user->email, // Include email in the response
            'id' => $user->id
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
    public function redirectToAuth(): JsonResponse
    {
        return response()->json([
            'url' => Socialite::driver('google')->redirect()->getTargetUrl(),
        ]);
    }
    public function handleAuthCallback(): JsonResponse
    {
        try {
            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = Socialite::driver('google')->redirect()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        /** @var User $user */
        $user = User::query()
            ->firstOrCreate(
                [
                    'email' => $socialiteUser->getEmail(),
                ],
                [
                    'email_verified_at' => now(),
                    'name' => $socialiteUser->getName(),
                    'google_id' => $socialiteUser->getId(),                ]
            );

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('google-token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }


    


}