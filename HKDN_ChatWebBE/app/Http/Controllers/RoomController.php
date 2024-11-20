<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use App\Models\RoomUser;
use Illuminate\Http\Response;
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

    public function show()
    {
        // Lấy danh sách tất cả các phòng
        $rooms = Room::with('users')->get();

        return response()->json([
            'success' => true,
            'rooms' => $rooms
        ]);
    }
    
    // Create room - Allowed for role_id 1 and 3
    public function create(CreateRoomRequest $request)
    {
        $validated = $request->validated();
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !in_array($user->role_id, [1, 3])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only users with role_id 1 or 3 can create rooms.'
            ], Response::HTTP_FORBIDDEN);
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

    public function update(Request $request, $room_id)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email', // Validate email
            'name' => 'nullable|string|max:255',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || $user->role_id !== 1) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only users with role_id 1 can update rooms.'
            ], Response::HTTP_FORBIDDEN);
        }

        $room = Room::find($room_id);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $room->update([
            'name' => $validated['name'] ?? $room->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Room updated successfully',
            'room' => $room
        ]);
    }

    public function destroy(Request $request, $room_id)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email', // Validate email
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || $user->role_id !== 1) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only users with role_id 1 can delete rooms.'
            ], Response::HTTP_FORBIDDEN);
        }

        $room = Room::find($room_id);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully'
        ]);
    }

    public function joinroom(EntryRoomRequest $request)
    {
        // Dữ liệu đã được xác thực qua EntryRoomRequest
        $validated = $request->validated();

        // Kiểm tra nếu người dùng đã đăng nhập
        $currentUser = Auth::user();
        if (!$currentUser) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to join a room'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Lấy phòng theo room_id
        $room = Room::find($validated['room_id']);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Kiểm tra quyền thêm người dùng
        if ($currentUser->role_id === 1) {
            // Người có role_id = 1 có thể thêm người vào tất cả các phòng
            return $this->addUserToRoom($currentUser, $room, $validated['email']);
        }

        if ($currentUser->role_id === 3) {
            // Người có role_id = 3 chỉ có thể thêm người vào phòng mà họ là creator
            if ($room->creator_id !== $currentUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the creator of the room can add users to this room'
                ], Response::HTTP_FORBIDDEN);
            }
            return $this->addUserToRoom($currentUser, $room, $validated['email']);
        }

        // Nếu role_id không phải 1 hoặc 3, không cho phép thêm người vào phòng
        return response()->json([
            'success' => false,
            'message' => 'You do not have permission to add users to this room'
        ], Response::HTTP_FORBIDDEN);
    }

    private function addUserToRoom($currentUser, $room, $email)
    {
        // Tìm người dùng dựa trên email
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Kiểm tra xem người dùng đã tham gia phòng chưa
        $existingRoomUser = RoomUser::where('user_id', $user->id)
            ->where('room_id', $room->id)
            ->first();

        if ($existingRoomUser) {
            return response()->json([
                'success' => false,
                'message' => 'User already in this room'
            ], Response::HTTP_CONFLICT);
        }

        // Thêm người dùng vào phòng
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
}