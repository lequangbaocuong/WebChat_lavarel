<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthGoogleController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\RoomController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Các route không yêu cầu người dùng đăng nhập
Route::post('/forgot-password', ForgotPasswordController::class);
Route::post('/reset-password', ResetPasswordController::class);

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
Route::post('/createroom', [RoomController::class, 'create']);
Route::post('/joinroom', [RoomController::class, 'joinroom']);
Route::post('/leave', [RoomController::class, 'leaveRoom']);

Route::middleware('auth:sanctum')->post('/remove-user-from-room', [RoomController::class, 'removeUserFromRoom']);

