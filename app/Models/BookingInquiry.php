<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'customer_name',
        'email',
        'phone_whatsapp',
        'nationality',
        'preferred_travel_date',
        'travelers_count',
        'message',
        'internal_notes',
        'status',
    ];

    protected $casts = [
        'preferred_travel_date' => 'date',
        'travelers_count' => 'integer',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(HikingPackage::class, 'package_id');
    }
}