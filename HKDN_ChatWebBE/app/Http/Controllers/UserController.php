<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\FindUserRequest;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
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
}
