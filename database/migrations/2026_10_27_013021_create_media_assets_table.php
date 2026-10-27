<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table) {$table->id();
            $table->string('file_path');$table->string('file_name');
            $table->string('mime_type');$table->unsignedBigInteger('file_size');
            $table->string('alt_text')->nullable();$table->string('caption')->nullable();
            $table->string('category')->default('expedition'); // expedition, summits, camps, guides$table->integer('display_order')->default(0);
            $table->boolean('is_featured')->default(false);$table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};