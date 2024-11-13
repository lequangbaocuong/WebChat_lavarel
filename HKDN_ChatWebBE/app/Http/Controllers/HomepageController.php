<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    public function GetName(Request $request) {
        $name=User::where('username');
        return $name;
    }
}