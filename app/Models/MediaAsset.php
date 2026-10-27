<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'alt_text',
        'caption',
        'category',
        'display_order',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'file_size' => 'integer',
        'display_order' => 'integer',
    ];
}