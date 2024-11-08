<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email', // Kiểm tra email hợp lệ và tồn tại
            'room_id' => 'required|exists:table_rooms,id',  // Kiểm tra room_id tồn tại trong bảng table_rooms
        ];
    }
    /**
     * Tùy chỉnh thông báo lỗi.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.required' => 'Email is required.',
            'email.email' => 'Invalid email format.',
            'email.exists' => 'This email does not exist in our records.',
            'room_id.required' => 'Room ID is required.',
            'room_id.exists' => 'This room does not exist.',
        ];
    }
}
