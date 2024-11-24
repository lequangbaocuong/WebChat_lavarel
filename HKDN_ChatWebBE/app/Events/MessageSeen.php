<?php

namespace App\Events;

use Illuminate\Support\Facades\Log;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSeen
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $messageId;
    public $seenBy;

    public function __construct($messageId, $seenBy)
    {
        $this->messageId = $messageId;
        $this->seenBy = $seenBy;
    }

    public function broadcastOn()
    {
        return new Channel('room-messages');
    }

    public function broadcastWith()
    {
        $seenBy = $this->seenBy->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'avatar' => $user->avatar,
            ];
        });
    
        Log::info('Broadcasting MessageSeen Event:', [
            'messageId' => $this->messageId,
            'seenBy' => $seenBy,
        ]);
    
        return [
            'messageId' => $this->messageId,
            'seenBy' => $seenBy,
        ];
    }
}
