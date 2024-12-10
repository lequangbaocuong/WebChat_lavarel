<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class EntryRoomRequest extends FormRequest
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
            'emails' => 'required|array', // Ensure 'emails' is an array
            'emails.*' => 'required|email|exists:users,email', // Validate each email
            'room_id' => 'required|exists:table_rooms,id', // Check if room_id exists
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'emails.required' => 'Emails are required.',
            'emails.array' => 'Emails must be an array.',
            'emails.*.required' => 'Each email is required.',
            'emails.*.email' => 'Each email must be a valid email address.',
            'emails.*.exists' => 'One or more emails do not exist in our records.',
            'room_id.required' => 'Room ID is required.',
            'room_id.exists' => 'This room does not exist.',
        ];
    }
}
