<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function getGoogleSignInUrl()
    {
        try {
            $url = Socialite::driver('google')->redirect()->getTargetUrl();
            return response()->json(['url' => $url], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function loginCallback(Request $request)
    {
        try {
            $state = $request->input('state');

            parse_str($state, $result);
            $googleUser = Socialite::driver('google')->user(); 


            $user = User::where('email', $googleUser->email)->first(); 

            if (!$user) {
                $user = User::create([
                    'email' => $googleUser->email,
                    'username' => $googleUser->username,
                    'google_id' => $googleUser->id,
                    'password' => '123456789abC', // Consider using a stronger password hashing mechanism
                ]);
            }

            Auth::login($user); // Log the user in
            return response()->json(['message' => 'Login successful'], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
