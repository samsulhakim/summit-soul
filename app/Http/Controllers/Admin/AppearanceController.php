<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    public function index(): Response
    {
        // Ambil pengaturan tema saat ini
        $themeColors = DB::table('site_settings')->where('key', 'theme_colors')->first();
        $typography = DB::table('site_settings')->where('key', 'typography')->first();
        $brandIdentity = DB::table('site_settings')->where('key', 'brand_identity')->first();
        $heroSection = DB::table('page_sections')->where('page_slug', 'home')->where('section_key', 'hero')->first();
        $heroContent = $heroSection
            ? json_decode($heroSection->content_draft ?: $heroSection->content_published ?: '{}', true)
            : [];

        return Inertia::render('Admin/Appearance/Index', [
            'themeColors' => $themeColors ? json_decode($themeColors->value_draft ?: $themeColors->value_published, true) : [],
            'typography' => $typography ? json_decode($typography->value_draft ?: $typography->value_published, true) : [],
            'brandIdentity' => $brandIdentity ? json_decode($brandIdentity->value_draft ?: $brandIdentity->value_published, true) : [],
            'heroLayout' => $heroSection ? json_decode($heroSection->layout_draft ?: $heroSection->layout_published, true) : [],
            'heroContent' => is_array($heroContent) ? $heroContent : [],
        ]);
    }

    public function updateDraft(Request $request)
    {
        $validated = $request->validate([
            // Colors
            'themeColors.primary_color' => ['required', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'themeColors.secondary_color' => ['required', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'themeColors.accent_color' => ['required', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'themeColors.dark_bg' => ['required', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],
            'themeColors.main_text' => ['required', 'regex:/^#([a-f0-9]{6}|[a-f0-9]{3})$/i'],

            // Typography
            'typography.heading_font' => 'required|string|in:Playfair Display,Cinzel,Montserrat,Inter',
            'typography.body_font' => 'required|string|in:Inter,Roboto,Lora,Merriweather',
            'typography.heading_size_preset' => 'required|in:compact,regular,large,extra_large',
            'typography.body_size_preset' => 'required|in:small,regular,large',

            // Desktop & Mobile Layout Presets
            'heroLayout.desktop_height' => 'required|in:auto,screen,large,screen_padded',
            'heroLayout.mobile_height' => 'required|in:auto,large,medium,full',
            'heroLayout.content_alignment' => 'required|in:left,center,right',
            'heroLayout.mobile_text_alignment' => 'required|in:left,center',
            'heroLayout.container_width' => 'required|in:boxed,wide,full',
            'heroBackground' => ['nullable', 'image', 'mimes:jpeg,png,webp,jpg', 'max:5120'],
        ]);

        $heroSection = DB::table('page_sections')
            ->where('page_slug', 'home')
            ->where('section_key', 'hero')
            ->first();

        abort_unless($heroSection, 404);

        $backgroundPath = $request->hasFile('heroBackground')
            ? $request->file('heroBackground')->store('hero', 'public')
            : null;

        DB::transaction(function () use ($validated, $heroSection, $backgroundPath) {
            // Update draft settings
            DB::table('site_settings')->where('key', 'theme_colors')->update([
                'value_draft' => json_encode($validated['themeColors']),
                'updated_at' => now(),
            ]);

            DB::table('site_settings')->where('key', 'typography')->update([
                'value_draft' => json_encode($validated['typography']),
                'updated_at' => now(),
            ]);

            DB::table('page_sections')->where('page_slug', 'home')->where('section_key', 'hero')->update([
                'layout_draft' => json_encode($validated['heroLayout']),
                'updated_at' => now(),
            ]);

            if ($backgroundPath) {
                $currentContent = json_decode(
                    $heroSection->content_draft ?: $heroSection->content_published ?: '{}',
                    true
                );
                $heroContent = is_array($currentContent) ? $currentContent : [];
                $heroContent['background_image'] = $backgroundPath;

                DB::table('page_sections')->where('id', $heroSection->id)->update([
                    'content_draft' => json_encode($heroContent),
                    'updated_at' => now(),
                ]);
            }
        });

        return back()->with('success', 'Draft tampilan visual berhasil disimpan.');
    }

    public function publish(Request $request)
    {
        DB::transaction(function () {
            // Salin value_draft ke value_published untuk tema
            $settings = DB::table('site_settings')->whereIn('key', ['theme_colors', 'typography'])->get();
            foreach ($settings as $setting) {
                if ($setting->value_draft) {
                    DB::table('site_settings')->where('id', $setting->id)->update([
                        'value_published' => $setting->value_draft,
                        'updated_at' => now(),
                    ]);
                }
            }

            // Salin layout_draft ke layout_published
            $sections = DB::table('page_sections')->where('page_slug', 'home')->where('section_key', 'hero')->get();
            foreach ($sections as $section) {
                if ($section->content_draft) {
                    DB::table('page_sections')->where('id', $section->id)->update([
                        'content_published' => $section->content_draft,
                        'updated_at' => now(),
                    ]);
                }

                if ($section->layout_draft) {
                    DB::table('page_sections')->where('id', $section->id)->update([
                        'layout_published' => $section->layout_draft,
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        return back()->with('success', 'Pengaturan tema resmi diterbitkan ke website publik.');
    }
}