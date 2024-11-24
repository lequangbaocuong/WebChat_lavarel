<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Str;

class VideoCallController extends Controller
{
    public function makeCall($roomId) {
        $user = Auth::user();

        $room = Room::where("id", $roomId)->first();

        if ($room == null) {
            return response()->json([
                'message' => 'Phòng chat không tồn tại.'
            ], 403);
        }
        
        if (!$room->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập phòng chat này.'
            ], 403);
        }

        if ($room->call_room === null) {
            $room->call_room = Str::uuid();
            $room->save();
        }

        return response([
            "call_room" => $room->call_room
        ], 200);
    }

}
