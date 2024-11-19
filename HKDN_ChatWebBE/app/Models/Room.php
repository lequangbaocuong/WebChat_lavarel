<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'table_rooms'; // Bảng được sử dụng là 'table_rooms'

    protected $fillable = [
        'name',
        'creator_id',
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'table_room_users', 'room_id', 'user_id');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
