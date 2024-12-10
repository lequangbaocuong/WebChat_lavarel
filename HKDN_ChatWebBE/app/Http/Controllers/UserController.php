<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Http\Requests\User\FindUserRequest;
class UserController extends Controller
{
    public function getProfile(Request $request)
    {
   
        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        // Nếu không tìm thấy người dùng
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        return response()->json([
            'name' => $user->username,
            'phone' => $user->phone,
            'email' => $user->email,
            'avatar'=>$user->avatar,
        ]);
    }
    public function find(FindUserRequest $request) {
        $field = $request->validated();
        $searchValue = $field['search'];

        $users = User::where('username', 'like', "%$searchValue%")
                        ->orWhere('email', 'like', "%$searchValue%")
                        ->get();

        return response([
            'users' => $users
        ], 200);
    }
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

        return response()->json(['success'=>true,'message' => 'Thêm mới người dùng thành công', 'user' => $user], 201);
    }

    // Edit user - Only allowed for role_id = 1


    public function changePassword(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'old_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // new_password_confirmation phải được gửi kèm
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if the old password is correct
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu cũ không đúng.'
            ], 400);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công.'
        ]);
    }
    public function update(Request $request, $id)
    {
        if (Auth::user()->role_id !== 1) {
            return response()->json(['message2' => 'Access denied. Only users with role_id 1 can perform this action.'], 403);
        }

        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message2' => 'User not found'], 404);
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
            return response()->json(['success'=>true,'errors' => $validator->errors()], 422);
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

        return response()->json(['success'=>true,'message2' => 'User updated successfully', 'user' => $user]);
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

    public function updateprofile(Request $request)
    {
        // Validate đầu vào
        $validatedData = $request->validate([
            'email' => 'required|email|exists:users,email',
            'username' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|string', // Avatar dưới dạng base64
        ]);

        try {
            // Tìm người dùng bằng email
            $user = User::where('email', $validatedData['email'])->first();

            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại'], 404);
            }

            // Cập nhật thông tin người dùng
            if (isset($validatedData['username'])) {
                $user->username = $validatedData['username'];
            }

            if (isset($validatedData['phone'])) {
                $user->phone = $validatedData['phone'];
            }

            if (isset($validatedData['avatar'])) {
                $user->avatar = $validatedData['avatar']; // Lưu chuỗi base64
            }

            $user->save();

            return response()->json([
                'message' => 'Cập nhật thông tin thành công',
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar, // Trả về chuỗi base64
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi khi cập nhật thông tin', 'error' => $e->getMessage()], 500);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Xử lý upload ảnh
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarPath = $avatar->store('avatars', 'public'); // Lưu vào storage/app/public/avatars

            // Cập nhật avatar cho người dùng
            $user->avatar = $avatarPath;
            $user->save();

            return response()->json(['avatar' => $user->avatar]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }


    //Đăng nhập cho admin
    public function login_admin(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        $user = User::where('email', $credentials['email'])->first();
    
        // Kiểm tra nếu email không tồn tại
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Email không tồn tại'], 404);
        }
    
        // Kiểm tra mật khẩu
        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Mật khẩu không đúng'], 401);
        }
    
        // Chỉ cho phép role_id = 1 đăng nhập
        if ($user->role_id != 1) {
            return response()->json(['success' => false, 'message' => 'Bạn không có quyền truy cập'], 403);
        }
    
        // Tạo token cho admin
        $token = $user->createToken('admin-token')->plainTextToken;
    
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'email' => $user->email,
            'id' => $user->id
        ]);
    } 

}