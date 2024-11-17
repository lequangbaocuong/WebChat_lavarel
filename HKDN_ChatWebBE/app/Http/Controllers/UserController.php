<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // List users - Only allowed for role_id = 1
    public function index()
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access denied. Only users with role_id 1 can perform this action.'], 403);
        }

        $users = User::with('role')->get(); // Include role information
        return response()->json($users);
    }

    // Add user - Only allowed for role_id = 1
    public function store(Request $request)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access denied. Only users with role_id 1 can perform this action.'], 403);
        }

        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'nullable|exists:role,id',
            'profile_img_path' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create new user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'role_id' => $request->role_id,
            'profile_img_path' => $request->profile_img_path,
            'status' => $request->status ?? 'active',
            'otp' => $request->otp,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Edit user - Only allowed for role_id = 1
    public function update(Request $request, $id)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access denied. Only users with role_id 1 can perform this action.'], 403);
        }

        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'username' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role_id' => 'nullable|exists:role,id',
            'profile_img_path' => 'nullable|string|max:255',
            'status' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update the user
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->role_id = $request->role_id ?? $user->role_id;
        $user->profile_img_path = $request->profile_img_path ?? $user->profile_img_path;
        $user->status = $request->status ?? $user->status;
        $user->otp = $request->otp ?? $user->otp;
        $user->save();

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Delete user - Only allowed for role_id = 1
    public function destroy($id)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message' => 'Access denied. Only users with role_id 1 can perform this action.'], 403);
        }

        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function updateRole(Request $request, $user_id)
    {
        // Validate request
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email', // Email của người thực hiện yêu cầu
            'new_role_id' => 'required|integer|exists:roles,id' // Vai trò mới cần cập nhật
        ]);

        // Tìm người dùng thực hiện yêu cầu
        $requestingUser = User::where('email', $validated['email'])->first();

        // Kiểm tra nếu người dùng không có role_id là 1
        if (!$requestingUser || $requestingUser->role_id !== 1) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only users with role_id 1 can update roles.'
            ], Response::HTTP_FORBIDDEN);
        }

        // Tìm người dùng cần chỉnh sửa role
        $userToUpdate = User::find($user_id);

        if (!$userToUpdate) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Cập nhật role_id của người dùng
        $userToUpdate->role_id = $validated['new_role_id'];
        $userToUpdate->save();

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully',
            'user' => $userToUpdate
        ]);
    }


    public function resetPassword(Request $request)
    {
        // Validate the email input
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');

        // Tìm người dùng bằng email
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại'], 404);
        }

        // Tạo một mật khẩu mới gồm 10 chữ số ngẫu nhiên
        $newPassword = substr(str_shuffle('0123456789'), 0, 10);

        // Cập nhật mật khẩu của người dùng và hash mật khẩu
        $user->password = Hash::make($newPassword);
        $user->save();

        // Gửi mật khẩu mới qua email
        Mail::to($email)->send(new VerificationCodeMail($newPassword));

        return response()->json(['success' => true, 'message' => 'Mật khẩu mới đã được gửi đến email của bạn']);
    }
}
