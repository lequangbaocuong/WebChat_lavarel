<?php

namespace App\Http\Controllers;

use App\Events\MessageCreated;
use App\Models\Room;
use App\Models\Message;
use App\Events\MessageSeen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\SendMessageRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Add this line
use App\Jobs\SendMessageJob;
use App\Events\MessageSent;

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
            Log::error('Room not found', ['roomId' => $roomId]);
            return response()->json([
                'success' => false,
                'message' => 'Phòng chat không tồn tại.'
            ], 404);
        }

        // Kiểm tra xem người dùng có tham gia phòng chat không
        if (!$room->users()->where('user_id', $user->id)->exists()) {
            Log::error('User does not have access to the room', ['userId' => $user->id, 'roomId' => $roomId]);
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập phòng chat này.'
            ], 403);
        }

        // Lấy các tin nhắn trong phòng chat, sắp xếp theo thời gian
        $messages = $room->messages()->with('user')->orderBy('created_at', 'asc')->get()
            ->map(function ($message) {
                $message->file_url = $message->file_path ? asset('storage/' . $message->file_path) : null;
                return $message;
            });

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
            'file_path' => null,
        ]);

        // Tải lại tin nhắn với thông tin người gửi
        $message->load('user');
        broadcast(new MessageCreated($roomId, $message))->toOthers();
        SendMessageJob::dispatch($message);
        broadcast(new MessageSent($roomId, $message))->toOthers();    
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

    public function uploadFile(Request $request, $roomId)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,docx|max:10240', // Adjust file types as needed
        ]);


        $user = Auth::user();

        // Check if the room exists
        $room = Room::find($roomId);
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found',
            ], 404);
        }

        // Check if the user has access to the room
        if (!$room->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have access to this room',
            ], 403);
        }

        // Check if file is in the request
        if ($request->hasFile('file')) {
            // Store the file in the storage
            $filePath = $request->file('file')->store('uploads', 'public');
         
            // Create a new message with the file path
            $message = new Message();
            $message->room_id = $roomId;
            $message->user_id = $user->id;
            $message->content = $request->file('file')->getClientOriginalName();
            $message->file_path = $filePath;
            $message->save();
            $message->load('user');

            broadcast(new MessageCreated($roomId, $message))->toOthers();

            return response()->json([
                'success' => true,
                'message' => [
                    'message' => $message,     // Đưa thông tin tin nhắn vào
                    'username' => $user->username, // Thêm tên người dùng vào
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded',
        ], 400);
    }

    public function pinMessage($roomId, $messageId)
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
                'message' => 'Chỉ Moderator của phòng mới có quyền ghim tin nhắn.'
            ], 403);
        }

        // Tìm tin nhắn cần ghim
        $message = Message::where('room_id', $roomId)->where('id', $messageId)->first();
        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Tin nhắn không tồn tại.'
            ], 404);
        }

        // Ghim tin nhắn
        $message->is_pinned = true;
        $message->save();

        return response()->json([
            'success' => true,
            'message' => 'Tin nhắn đã được ghim.'
        ], 200);
    }

    public function unpinMessage($roomId, $messageId)
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
                'message' => 'Chỉ Moderator của phòng mới có quyền bỏ ghim tin nhắn.'
            ], 403);
        }

        // Tìm tin nhắn cần bỏ ghim
        $message = Message::where('room_id', $roomId)->where('id', $messageId)->first();
        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Tin nhắn không tồn tại.'
            ], 404);
        }

        // Bỏ ghim tin nhắn
        $message->is_pinned = false;
        $message->save();

        return response()->json([
            'success' => true,
            'message' => 'Tin nhắn đã được bỏ ghim.'
        ], 200);
    }

    public function getPinnedMessages($roomId)
{
    // Lấy người dùng hiện tại
    $user = Auth::user();

    // Kiểm tra xem phòng chat có tồn tại không
    $room = Room::find($roomId);
    if (!$room) {
        return response()->json([
            'success' => false,
            'message' => 'Phòng chat không tồn tại.'
        ], 404);
    }

   
  

    // Lấy danh sách tin nhắn đã ghim
    $pinnedMessages = Message::where('room_id', $roomId)
        ->where('is_pinned', true) // Chỉ lấy tin nhắn đã ghim
        ->orderBy('created_at', 'desc') // Sắp xếp theo thời gian
        ->get();

    // Trả về danh sách tin nhắn
    return response()->json([
        'success' => true,
        'messages' => $pinnedMessages
    ], 200);
}
}