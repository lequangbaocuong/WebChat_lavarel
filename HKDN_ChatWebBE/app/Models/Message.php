<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages'; // Bảng trung gian

    protected $fillable = [
        'room_id',
        'user_id',
        'content',
    ];
    /**
     * Người gửi tin nhắn.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Phòng chat chứa tin nhắn.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
