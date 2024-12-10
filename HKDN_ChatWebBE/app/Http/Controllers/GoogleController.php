<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        // Redirect to Google's OAuth page
        return response()->json(['url' => Socialite::driver('google')->redirect()->getTargetUrl()]);
    }

    public function handleGoogleCallback()
    {
        try {
            // Get the user data from Google
            $googleUser = Socialite::driver('google')->user();

            // Find or create the user in your database
            $user = User::updateOrCreate(
                ['google_id' => $googleUser->id],
                [
                    'email' => $googleUser->email,
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    'password' => encrypt('123456dummy') // Set a default password
                ]
            );

            // Log the user in
            Auth::login($user);

            // Redirect the user to the intended page
            return redirect()->route('home'); // Or wherever you want to redirect

        } catch (Exception $e) {
            // Log the error for debugging
            Log::error('Google callback error: ' . $e->getMessage());

            // Handle the error gracefully and show a user-friendly message
            return redirect()->route('api/login')->withErrors(['google_error' => 'An error occurred during the Google sign-in process.']);
        }
    }
}