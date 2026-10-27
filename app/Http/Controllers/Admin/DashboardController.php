<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Metrik riil sesuai Section 5 Master Prompt
        $metrics = [
            'published_packages' => DB::table('hiking_packages')->where('status', 'published')->count(),
            'draft_packages' => DB::table('hiking_packages')->where('status', 'draft')->count(),
            'published_testimonials' => DB::table('testimonials')->where('is_published', true)->count(),
            'new_inquiries' => DB::table('booking_inquiries')->where('status', 'new')->count(),
            'in_progress_inquiries' => DB::table('booking_inquiries')->whereIn('status', ['contacted', 'awaiting_confirmation'])->count(),
        ];

        // Daftar pesan inquiry terbaru
        $recentInquiries = DB::table('booking_inquiries')
            ->leftJoin('hiking_packages', 'booking_inquiries.package_id', '=', 'hiking_packages.id')
            ->select(
                'booking_inquiries.id',
                'booking_inquiries.customer_name',
                'booking_inquiries.email',
                'booking_inquiries.status',
                'booking_inquiries.created_at',
                'hiking_packages.title as package_title'
            )
            ->latest('booking_inquiries.created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => $metrics,
            'recentInquiries' => $recentInquiries,
        ]);
    }
}