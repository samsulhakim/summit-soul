<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookingInquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingInquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BookingInquiry::with('package:id,title');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone_whatsapp', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $inquiries = $query->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['search', 'status']),
            'statuses' => [
                'new' => 'New',
                'contacted' => 'Contacted',
                'awaiting_confirmation' => 'Awaiting Confirmation',
                'confirmed' => 'Confirmed',
                'completed' => 'Completed',
                'cancelled' => 'Cancelled',
            ],
        ]);
    }

    public function show(BookingInquiry $inquiry): Response
    {
        $inquiry->load('package:id,title,price,currency,price_unit');

        // Format nomor WhatsApp untuk tautan click-to-chat
        $whatsappUrl = null;
        if ($inquiry->phone_whatsapp) {
            $cleanPhone = preg_replace('/[^0-9]/', '', $inquiry->phone_whatsapp);
            if (str_starts_with($cleanPhone, '0')) {
                $cleanPhone = '62' . substr($cleanPhone, 1);
            }

            $messageText = sprintf(
                "Hello %s, thank you for your inquiry with SUMMIT SOUL regarding the %s expedition. I am reaching out to discuss your preferred dates (%s). How can we assist you?",
                $inquiry->customer_name,
                $inquiry->package ? $inquiry->package->title : 'custom',
                $inquiry->preferred_travel_date ? $inquiry->preferred_travel_date->format('Y-m-d') : 'to be decided'
            );

            $whatsappUrl = 'https://wa.me/' . $cleanPhone . '?text=' . rawurlencode($messageText);
        }

        return Inertia::render('Admin/Inquiries/Show', [
            'inquiry' => $inquiry,
            'whatsappUrl' => $whatsappUrl,
        ]);
    }

    public function updateStatus(Request $request, BookingInquiry $inquiry)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,awaiting_confirmation,confirmed,completed,cancelled',
        ]);

        $inquiry->update(['status' => $validated['status']]);

        return back()->with('success', 'Status inquiry berhasil diperbarui.');
    }

    public function saveNotes(Request $request, BookingInquiry $inquiry)
    {
        $validated = $request->validate([
            'internal_notes' => 'nullable|string|max:2000',
        ]);

        $inquiry->update(['internal_notes' => $validated['internal_notes']]);

        return back()->with('success', 'Catatan internal berhasil disimpan.');
    }
}