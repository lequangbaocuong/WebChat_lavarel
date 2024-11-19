<?php

namespace App\Http\Controllers;

use App\Http\Requests\Room\AddUserToRoomRequest;
use App\Http\Requests\Room\GetRoomUserRequest;
use App\Models\Room;
use App\Models\User;
use App\Models\RoomUser;
// use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Requests\User\EntryRoomRequest;
use App\Http\Requests\User\LeaveRoomRequest;
use App\Http\Requests\User\CreateRoomRequest;
use App\Http\Requests\User\DeleteUserRoomRequest;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Check if user is authenticated
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);  // Unauthorized if not authenticated
            }

            $user = Auth::user(); // Now safe to call Auth::user()

            // Get the rooms associated with the authenticated user
            $rooms = Room::whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();

            if ($rooms->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No rooms found for this user.',
                ], 404); // Not found if no rooms exist
            }

            return response()->json([
                'success' => true,
                'rooms' => $rooms,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function create(CreateRoomRequest $request)
    {
   
        $validated = $request->validated();
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }
        $room = Room::create([
            'name' => $validated['name'],
            'creator_id' => $user->id,
        ]);
        RoomUser::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Room created successfully',
            'room' => $room
        ], Response::HTTP_CREATED);
    }

    public function joinroom(EntryRoomRequest $request)
    {
        // Dữ liệu đã được xác thực qua JoinRoomRequest
        $validated = $request->validated();

        // Tìm người dùng dựa trên email
        $user = User::where('email', $validated['email'])->first();

        // Tìm phòng theo room_id
        $room = Room::find($validated['room_id']);

        // Kiểm tra nếu người dùng đã tham gia phòng
        $existingRoomUser = RoomUser::where('user_id', $user->id)
                                    ->where('room_id', $room->id)
                                    ->first();

        if ($existingRoomUser) {
            return response()->json([
                'success' => false,
                'message' => 'User already in this room'
            ], Response::HTTP_CONFLICT);
        }

        // Thêm người dùng vào phòng (bảng trung gian table_room_users)
        RoomUser::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User joined the room successfully',
            'room' => $room,
        ], Response::HTTP_OK);
    }
    
    public function leaveRoom(LeaveRoomRequest $request)
    {
        // Dữ liệu đã được xác thực qua LeaveRoomRequest
        $validated = $request->validated();

        // Tìm người dùng dựa trên email
        $user = User::where('email', $validated['email'])->first();

        // Tìm phòng theo room_id
        $room = Room::find($validated['room_id']);

        // Kiểm tra nếu người dùng đã tham gia phòng
        $roomUser = RoomUser::where('user_id', $user->id)
                            ->where('room_id', $room->id)
                            ->first();

        if (!$roomUser) {
            return response()->json([
                'success' => false,
                'message' => 'User is not part of this room'
            ], Response::HTTP_NOT_FOUND);
        }

        // Xóa người dùng khỏi phòng (xóa bản ghi trong bảng trung gian table_room_users)
        $roomUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'User left the room successfully',
            'room' => $room,
        ], Response::HTTP_OK);
    }

    public function removeUserFromRoom(DeleteUserRoomRequest $request)
    {
        $user2 = Auth::user(); // Đảm bảo dùng Auth::user() hoặc auth()->user()
        // Xác thực dữ liệu đầu vào
        $validated = $request->validated();

        // Tìm người dùng dựa trên email
        $user = User::where('email', $validated['email'])->first();

        // Kiểm tra nếu người dùng không tồn tại
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.'
            ], Response::HTTP_NOT_FOUND);
        }

        // Tìm phòng theo room_id
        $room = Room::find($validated['room_id']);

        // Kiểm tra nếu phòng không tồn tại
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room does not exist.'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($room->creator_id !== $user2->id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the room creator can remove a user.'
            ], Response::HTTP_FORBIDDEN);
        }
        
        // Kiểm tra nếu người bị xóa có phải là thành viên của phòng
        $roomUser = RoomUser::where('user_id', $user->id)
                            ->where('room_id', $room->id)
                            ->first();

        if (!$roomUser) {
            return response()->json([
                'success' => false,
                'message' => 'User is not part of this room.'
            ], Response::HTTP_NOT_FOUND);
        }

        // Xóa người dùng khỏi phòng (xóa bản ghi trong bảng trung gian table_room_users)
        $roomUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'User removed from the room successfully',
        ], Response::HTTP_OK);
    }

    public function addUserToRoom(AddUserToRoomRequest $request) {
        $field = $request->validated();

        $room = Room::find($field['room_id']);
        $emails = $field['emails'];
        $exist = 0;

        $users = [];
        foreach ($emails as $email) {
            $user = User::where('email', $email)->first();
            $existingRoomUser = RoomUser::where('user_id', $user->id)
                ->where('room_id', $room->id)
                ->first();

            if ($existingRoomUser) {
                $exist++;
                continue;
            }

            RoomUser::create([
                'user_id' => $user->id,
                'room_id' => $room->id,
            ]);

            $users[] = $user;
        }

        return response()->json([
            'success' => true,
            'message' => 'Added successfully',
            'users' => $users,
        ], status: Response::HTTP_OK);
    }

    public function getRoomUser(GetRoomUserRequest $request) {
        $field = $request->validated();

        $users = User::whereHas('rooms', function ($query) use ($field) {
                    $query->where('room_id', $field['room_id']);
                })->get();

        return response([
            'users' => $users
        ], 200);
    }
}