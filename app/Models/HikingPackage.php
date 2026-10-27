<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HikingPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'destination',
        'duration',
        'difficulty_level',
        'price',
        'currency',
        'price_unit',
        'max_group_size',
        'short_description',
        'full_description',
        'featured_image',
        'gallery_images',
        'included_services',
        'excluded_services',
        'requirements',
        'seo_title',
        'seo_description',
        'is_featured',
        'status',
        'display_order',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'included_services' => 'array',
        'excluded_services' => 'array',
        'requirements' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
    ];
}