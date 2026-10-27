<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'country',
        'review_text',
        'customer_avatar',
        'rating',
        'is_featured',
        'is_published',
        'display_order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'display_order' => 'integer',
    ];
}