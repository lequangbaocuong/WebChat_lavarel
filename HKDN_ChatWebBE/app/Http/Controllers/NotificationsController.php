<?php

namespace App\Http\Controllers;

use App\Helpers\FCMNotification;
use App\Models\Notifications;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    /**
     * Get notifications for the authenticated user.
     */
    public function getNoti()
    {
        $user = Auth::user();
        $notifications = Notifications::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function readNoti($id)
    {
        $notification = Notifications::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404);
        }

        $notification->read_at = now();
        $notification->save();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Send a notification to a user.
     */
    public function sendNoti(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'body' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::find($request->user_id);
        $body = $request->body;
        $avatar = $request->avatar;

        $fcmNotification = new FCMNotification();
        $fcmNotification->sendNotification($body, $user, $avatar);

        return response()->json([
            'success' => true,
            'message' => 'Notification sent',
        ]);
    }

    /**
     * Set the FCM token for the authenticated user.
     */
    public function setToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string|unique:users,fcm_token',
        ]);

        $user = Auth::user();
        $user->fcm_token = $request->fcm_token;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'FCM token set',
        ]);
    }
}