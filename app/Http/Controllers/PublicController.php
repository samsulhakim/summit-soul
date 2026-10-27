<?php

namespace App\Http\Controllers;

use App\Models\BookingInquiry;
use App\Services\HomePageData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    public function index(HomePageData $homePageData): Response
    {
        return Inertia::render('Public/Home', $homePageData->build());
    }

    public function submitInquiry(Request $request)
    {
        $validated = $request->validate([
            'package_id' => 'nullable|exists:hiking_packages,id',
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_whatsapp' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:100',
            'preferred_travel_date' => 'nullable|date|after_or_equal:today',
            'travelers_count' => 'required|integer|min:1|max:50',
            'message' => 'required|string|max:3000',
        ]);

        BookingInquiry::create([
            ...$validated,
            'status' => 'new',
        ]);

        return back()->with('success', 'Thank you! Your expedition inquiry has been received. Our lead guide will contact you shortly.');
    }
}
