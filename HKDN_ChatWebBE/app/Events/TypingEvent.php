<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;

class TypingEvent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $roomId;
    public $userId;
    public $isTyping;

    public function __construct($roomId, $userId, $isTyping)
    {
        $this->roomId = $roomId;
        $this->userId = $userId;
        $this->isTyping = $isTyping;
    }

    public function broadcastOn()
    {
        return new Channel('room.' . $this->roomId);
    }

    public function broadcastWith()
    {
        return [
            'userId' => $this->userId,
            'isTyping' => $this->isTyping,
        ];
    }
}