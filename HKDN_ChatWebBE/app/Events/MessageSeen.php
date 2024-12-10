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

class MessageSeen implements  ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $messageId;
    public $userId;
    public $avatarUrl;

    /**
     * Create a new event instance.
     *
     * @param int $messageId
     * @param int $userId
     * @param string $avatarUrl
     */
    public function __construct($messageId, $userId, $avatarUrl)
    {
        $this->messageId = $messageId;
        $this->userId = $userId;
        $this->avatarUrl = $avatarUrl;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('message-channel');  // Đặt tên kênh phát sóng
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return 'MessageSeen';
    }


}
