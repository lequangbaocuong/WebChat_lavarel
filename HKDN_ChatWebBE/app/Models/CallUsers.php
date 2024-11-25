<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CallUsers extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'room_id',
        'last_heartbeat_at'
    ];
}
