<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
return new class extends Migration
{
    public function up()
    {
        Schema::create('role', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps(); // Optional: use if you want created_at and updated_at columns
        });

        Artisan::call('db:seed', ['--class' => 'RoleSeeder']);
    }

    public function down()
    {
        Schema::dropIfExists('role');
    }
};