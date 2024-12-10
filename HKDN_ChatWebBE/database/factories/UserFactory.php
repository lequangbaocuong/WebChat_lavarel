<?php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'username' => $this->faker->userName,
            'google_id' => $this->faker->optional()->uuid,
            'email' => $this->faker->unique()->safeEmail,
            'password' => bcrypt('password'), // or use Hash::make('password')
            'profile_img_path' => $this->faker->optional()->imageUrl,
            'role_id' => 2, // Default role_id
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'otp' => $this->faker->optional()->numerify('######'),
            'status' => 'active',
            'avatar' => 'user.png',
            'phone' => $this->faker->optional()->phoneNumber,
            'fcm_token' => $this->faker->unique()->uuid,
        ];
    }
}