<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoCallController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;

use App\Http\Controllers\GoogleController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\AuthGoogleController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ForgotPasswordController;
use Illuminate\Broadcasting\BroadcastController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Các route không yêu cầu người dùng đăng nhập
Route::post('/forgot-password', ForgotPasswordController::class);
Route::post('/reset-password', ResetPasswordController::class);
Route::post('/send-verification-code', [VerificationController::class, 'sendVerificationCode']);
Route::post('/verifyOtp', [VerificationController::class, 'verifyOtp']);
// Các route yêu cầu người dùng đăng nhập
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['web'])->group(function () {
    Route::get('auth', [AuthController::class, 'redirectToAuth']);
    Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);
});


Route::middleware('auth:sanctum')->get('/rooms', [RoomController::class, 'index']);

// Route để lấy danh sách tất cả các phòng
Route::get('/showrooms', [RoomController::class, 'show']);
Route::post('/createroom', [RoomController::class, 'create']);
// Route để cập nhật phòng (update room) với room_id trong URL
Route::put('/rooms/update/{room_id}', [RoomController::class, 'update']);

// Route để xóa phòng (delete room) với room_id trong URL
Route::delete('/rooms/destroy/{room_id}', [RoomController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/joinroom', [RoomController::class, 'joinroom']);
});


Route::post('/leave', [RoomController::class, 'leaveRoom']);
Route::middleware('auth:sanctum')->post('/remove-user-from-room', [RoomController::class, 'removeUserFromRoom']);



Route::post('/add-user-to-room', [RoomController::class, 'addUserToRoom']);
Route::get('/find-user', [UserController::class, 'find']);

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [UserController::class, 'index']);        // List users
    Route::post('/adduser', [UserController::class, 'store']);       // Add user
    Route::put('/edituser/{id}', [UserController::class, 'update']);   // Edit user
    Route::delete('/deleteuser/{id}', [UserController::class, 'destroy']); // Delete user
    Route::get('/showrooms', [RoomController::class, 'show']);
    Route::post('/addroom', [RoomController::class, 'create']);
    Route::put('/editroom/{room_id}', [RoomController::class, 'update']);
    Route::delete('/deleteroom/{room_id}', [RoomController::class, 'destroy']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/broadcasting/auth', [BroadcastController::class, 'authenticate']);
    Route::get('/rooms/{roomId}/messages', [MessageController::class, 'getMessages']);
    Route::post('/rooms/{roomId}/messages', [MessageController::class, 'sendMessage']);
    Route::post('/rooms/{roomId}/upload', [MessageController::class, 'uploadFile']);
    Route::get('/rooms/{roomId}/pinned-messages', [MessageController::class, 'getPinnedMessages']);
    Route::delete('/rooms/{roomId}/messages/{messageId}', [MessageController::class, 'deleteMessage']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    Route::post('/upload-avatar', [UserController::class, 'uploadAvatar']);

    Route::post('/rooms/{roomId}/messages/{messageId}/pin', [MessageController::class, 'pinMessage']);
    Route::post('/rooms/{roomId}/messages/{messageId}/unpin', [MessageController::class, 'unpinMessage']);

    Route::get('room/{roomID}/get-call', [VideoCallController::class, 'getCall']);
    Route::post('room/{roomID}/make-call', [VideoCallController::class, 'makeCall']);
    Route::post('room/{roomID}/leave-call', [VideoCallController::class, 'leaveCall']);
    Route::post('room/{roomID}/heartbeat', [VideoCallController::class, 'updateHeartBeat']);
});
//Chuyển role người dùng
Route::put('/users/{user_id}/role', [UserController::class, 'updateRole']);
Route::get('/room/{roomId}/users', [RoomController::class, 'getRoomUser']);


Route::post('/admin-reset', [UserController::class, 'resetPassword']);

Route::post('/user/profile', [UserController::class, 'getProfile']);
Route::post('/user/update', [UserController::class, 'updateprofile']);

Route::post('/room/{roomId}/upload', [MessageController::class, 'uploadFile']);

 Route::middleware('auth:sanctum')->group(function () {
    Route::post('messages/{message}/seen', [MessageController::class, 'markAsSeen']);
});
 Route::get('/rooms/{room}/messages', [RoomController::class, 'getMessages'])->middleware('auth:sanctum');

 Route::middleware('auth:sanctum')->get('messages', [MessageController::class, 'index']);

