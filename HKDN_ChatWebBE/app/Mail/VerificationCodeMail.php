<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use SerializesModels;

    public $verificationCode;

    public function __construct($verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    public function build()
    {
        return $this->view('verification_code') // Đảm bảo đúng view
                    ->with([
                        'verificationCode' => $this->verificationCode, // Truyền đúng biến
                    ])
                    ->subject('Mã xác minh của bạn');
    }
}