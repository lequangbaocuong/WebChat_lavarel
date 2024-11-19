<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\Message;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Hiển thị các tin nhắn trong một phòng chat.
     *
     * @param  int  $roomId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMessages($roomId)
    {
        $user = Auth::user();

        // Kiểm tra xem phòng chat có tồn tại không
        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Phòng chat không tồn tại.'
            ], 404);
        }

        // Kiểm tra xem người dùng có tham gia phòng chat không
        if (!$room->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập phòng chat này.'
            ], 403);
        }

        // Lấy các tin nhắn trong phòng chat, sắp xếp theo thời gian
        $messages = $room->messages()->with('user')->orderBy('created_at', 'asc')->get();

        return response()->json([
            'success' => true,
            'messages' => $messages
        ], 200);
    }

    /**
     * Gửi một tin nhắn trong phòng chat.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $roomId
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(SendMessageRequest $request, $roomId)
    {
        $user = Auth::user();

        // Kiểm tra xem phòng chat có tồn tại không
        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Phòng chat không tồn tại.'
            ], 404);
        }

        // Kiểm tra xem người dùng có tham gia phòng chat không
        if (!$room->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền gửi tin nhắn trong phòng chat này.'
            ], 403);
        }

        // Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo tin nhắn mới
        $message = Message::create([
            'room_id' => $room->id,
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);

        // Tải lại tin nhắn với thông tin người gửi
        $message->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Tin nhắn đã được gửi.',
            'data' => $message
        ], 201);
    }

    public function deleteMessage($roomId, $messageId)
    {
        $user = Auth::user();

        // Kiểm tra xem phòng chat có tồn tại không
        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Phòng chat không tồn tại.'
            ], 404);
        }

        // Kiểm tra nếu người dùng là creator của phòng
        if ($room->creator_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ Moderator của phòng mới có quyền xóa tin nhắn.'
            ], 403);
        }

        // Tìm tin nhắn cần xóa
        $message = Message::where('room_id', $roomId)->where('id', $messageId)->first();
        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Tin nhắn không tồn tại.'
            ], 404);
        }

        // Xóa tin nhắn
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tin nhắn đã được xóa.'
        ], 200);
    }
}
