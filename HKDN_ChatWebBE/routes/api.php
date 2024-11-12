<?php

use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


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
    Route::get('./home',[HomepageController::class,'GetName']);
});