<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ResetPasswordRequest;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Str;

class ResetPasswordController extends Controller
{
    public function __invoke(ResetPasswordRequest $request)
    {
        $field = $request->validated();

        $status = Password::reset(
            $field,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => bcrypt($password)
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
