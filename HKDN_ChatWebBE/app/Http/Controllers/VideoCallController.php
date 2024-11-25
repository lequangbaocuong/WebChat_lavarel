<?php

namespace App\Http\Controllers;

use App\Models\CallUsers;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Str;
use Carbon\Carbon;

class VideoCallController extends Controller
{
    public function getCall($roomId) {
        $room = Room::where("id", $roomId)->first();
        $count = CallUsers::where("room_id", $roomId)
                        ->whereNotNull("last_heartbeat_at")
                        ->count();

        return response([
            "call_room" => $room->call_room,
            "participants" => $count
        ], 200);
    }

    public function makeCall($roomId) {
        $user = Auth::user();

        $room = Room::where("id", $roomId)->first();

        if ($room == null) {
            return response()->json([
                "message" => "Phòng chat không tồn tại."
            ], 403);
        }
        
        if (!$room->users()->where("user_id", $user->id)->exists()) {
            return response()->json([
                "message" => "Bạn không có quyền truy cập phòng chat này."
            ], 403);
        }

        if ($room->call_room === null) {
            $room->call_room = Str::uuid();
            $room->save();
        }

        CallUsers::updateOrCreate([
            "room_id" => $roomId,
            "user_id" => $user->id,
        ],[
           "last_heartbeat_at" => Carbon::now()
        ]);

        return response([
            "call_room" => $room->call_room
        ], 200);
    }

    public function leaveCall($roomId) {
        $user = Auth::user();

        CallUsers::updateOrCreate([
            "room_id" => $roomId,
            "user_id" => $user->id,
        ],[
           "last_heartbeat_at" => null
        ]);

        return response([
            "success" => True
        ], 200);
    }

    public function updateHeartBeat($roomId) {
        $user = Auth::user();

        CallUsers::updateOrCreate([
            "room_id" => $roomId,
            "user_id" => $user->id,
        ],[
           "last_heartbeat_at" => Carbon::now()
        ]);

        return response([
            "success" => True
        ], 200);
    }
}
