<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ForgotPasswordRequest;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function __invoke(ForgotPasswordRequest $request)
    {
        // $field = $request->validated();
        $data = collect($request->validated())->only(['email'])->toArray();

        $status = Password::sendResetLink($data);

        return $status == Password::RESET_LINK_SENT
            ? response([
                    'message' => $status
                ], 200)
            : response([
                    'message' => $status
                ], 400);
    }
}
