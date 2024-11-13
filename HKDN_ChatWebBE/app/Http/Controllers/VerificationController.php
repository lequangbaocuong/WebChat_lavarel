<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\VerificationCodeMail; // Thêm import Mailable nếu bạn dùng Mailable

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        // Validate email
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');
        $verificationCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Lưu mã OTP vào cơ sở dữ liệu
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại'], 404);
        }

        // Cập nhật mã OTP cho người dùng
        $user->otp = $verificationCode;
        $user->save();
        
        // Gửi mã OTP qua email
        Mail::to($email)->send(new VerificationCodeMail($verificationCode));

        return response()->json(['success' => true,'message' => 'Gửi thành công']);
    }

    public function verifyOtp(Request $request)
    {
        // Kiểm tra OTP
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6' // Kiểm tra OTP có đúng độ dài
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user && $user->otp == $request->otp) {
            // Cập nhật trạng thái tài khoản thành 'active'
            $user->status = 'active';
            $user->otp = null; // Xóa mã OTP sau khi xác thực
            $user->save();

            return response()->json(['success' => true,'message' => 'Xác nhận thành công']);
        } else {
            return response()->json(['success' => false,'message' => 'OTP không chính xác'], 400);
        }
    }
}