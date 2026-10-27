<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $contact = DB::table('site_settings')->where('key', 'contact_information')->first();
        $seo = DB::table('site_settings')->where('key', 'seo_general')->first();

        return Inertia::render('Admin/Settings/Index', [
            'contact' => $contact ? json_decode($contact->value_draft ?: $contact->value_published, true) : [],
            'seo' => $seo ? json_decode($seo->value_draft ?: $seo->value_published, true) : [],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            // Contact Details
            'contact.business_name' => 'required|string|max:255',
            'contact.guide_name' => 'required|string|max:255',
            'contact.email' => 'required|email|max:255',
            'contact.whatsapp' => 'required|string|max:50',
            'contact.location' => 'required|string|max:255',
            'contact.instagram' => 'nullable|url|max:255',

            // SEO & Social Sharing
            'seo.meta_title' => 'required|string|max:70',
            'seo.meta_description' => 'required|string|max:160',
            'seo.canonical_url' => 'required|url|max:255',
            'seo.og_title' => 'nullable|string|max:70',
            'seo.og_description' => 'nullable|string|max:160',
        ]);

        DB::transaction(function () use ($validated) {
            DB::table('site_settings')->where('key', 'contact_information')->update([
                'value_published' => json_encode($validated['contact']),
                'value_draft' => json_encode($validated['contact']),
                'updated_at' => now(),
            ]);

            DB::table('site_settings')->where('key', 'seo_general')->update([
                'value_published' => json_encode($validated['seo']),
                'value_draft' => json_encode($validated['seo']),
                'updated_at' => now(),
            ]);
        });

        return back()->with('success', 'Pengaturan kontak dan SEO berhasil disimpan.');
    }
}