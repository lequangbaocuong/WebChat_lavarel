<?php

namespace App\Http\Controllers;
use App\Http\Requests\User\ResetPasswordRequest;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Mail;
class ResetPasswordController extends Controller
{
    public function __invoke(ResetPasswordRequest $request)
    {
        $field = $request->validated();

        $status = Password::reset(
            $field,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));
     
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET)
        {
            return response([
                'message' => 'Password reset successfully'
            ], 200);
        }

        return response([
            'message' => __($status)
        ], 400);
    }

    
}