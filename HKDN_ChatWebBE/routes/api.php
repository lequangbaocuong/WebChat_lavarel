<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;

Route::middleware('api')->group(function () {
    Route::post('/login', [ApiController::class, 'login']);
});