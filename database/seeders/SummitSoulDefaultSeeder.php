<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SummitSoulDefaultSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin Default
        User::updateOrCreate(
            ['email' => 'admin@summitsoul.com'],
            [
                'name' => 'Summit Soul Admin',
                'password' => Hash::make('AdminSoul2026!'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Default Brand & Appearance Settings
        $settings = [
            [
                'group' => 'brand',
                'key' => 'brand_identity',
                'value' => json_encode([
                    'brand_name' => 'SUMMIT SOUL',
                    'brand_descriptor' => 'Luxury Mountain Expeditions & Private Guiding',
                    'logo_url' => null,
                    'favicon_url' => null,
                ]),
            ],
            [
                'group' => 'appearance',
                'key' => 'theme_colors',
                'value' => json_encode([
                    'primary_color' => '#14251F',      // Forest Green
                    'secondary_color' => '#F1EBDD',    // Warm Sand
                    'accent_color' => '#D7B77A',       // Muted Gold
                    'dark_bg' => '#242820',            // Charcoal
                    'main_text' => '#F1EBDD',
                ]),
            ],
            [
                'group' => 'appearance',
                'key' => 'typography',
                'value' => json_encode([
                    'heading_font' => 'Playfair Display',
                    'body_font' => 'Inter',
                    'heading_size_preset' => 'large',
                    'body_size_preset' => 'regular',
                ]),
            ],
            [
                'group' => 'contact',
                'key' => 'contact_information',
                'value' => json_encode([
                    'business_name' => 'SUMMIT SOUL Luxury Adventure',
                    'guide_name' => 'Chief Mountain Guide',
                    'email' => 'contact@summitsoul.com',
                    'whatsapp' => '+6281234567890',
                    'location' => 'East Java, Indonesia',
                    'instagram' => 'https://instagram.com/summitsoul',
                ]),
            ],
            [
                'group' => 'seo',
                'key' => 'seo_general',
                'value' => json_encode([
                    'meta_title' => 'SUMMIT SOUL — Private Mountain Expeditions',
                    'meta_description' => 'Bespoke hiking and mountaineering experiences led by certified international mountain guides.',
                    'canonical_url' => 'https://summitsoul.com',
                ]),
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                [
                    'group' => $setting['group'],
                    'value_published' => $setting['value'],
                    'value_draft' => $setting['value'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 3. Default Page Sections (Hero & Guide Profile)
        DB::table('page_sections')->updateOrInsert(
            ['page_slug' => 'home', 'section_key' => 'hero'],
            [
                'title' => 'Homepage Hero Section',
                'is_visible' => true,
                'display_order' => 1,
                'content_published' => json_encode([
                    'eyebrow' => 'EXCLUSIVE PRIVATE MOUNTAIN EXPEDITIONS',
                    'headline' => 'Conquer High Altitudes with Absolute Mastery',
                    'description' => 'Uncompromising safety, bespoke route planning, and verified professional guiding across premier alpine peaks.',
                    'primary_cta_label' => 'Explore Expeditions',
                    'primary_cta_url' => '#packages',
                    'secondary_cta_label' => 'Direct Consultation',
                    'secondary_cta_url' => '#inquiry',
                    'overlay_opacity' => 50,
                ]),
                'content_draft' => json_encode([
                    'eyebrow' => 'EXCLUSIVE PRIVATE MOUNTAIN EXPEDITIONS',
                    'headline' => 'Conquer High Altitudes with Absolute Mastery',
                    'description' => 'Uncompromising safety, bespoke route planning, and verified professional guiding across premier alpine peaks.',
                    'primary_cta_label' => 'Explore Expeditions',
                    'primary_cta_url' => '#packages',
                    'secondary_cta_label' => 'Direct Consultation',
                    'secondary_cta_url' => '#inquiry',
                    'overlay_opacity' => 50,
                ]),
                'layout_published' => json_encode([
                    'desktop_height' => 'screen',
                    'mobile_height' => 'large',
                    'content_alignment' => 'left',
                ]),
                'layout_draft' => json_encode([
                    'desktop_height' => 'screen',
                    'mobile_height' => 'large',
                    'content_alignment' => 'left',
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 4. Default Navigation Links
        $navLinks = [
            ['label' => 'Expeditions', 'url' => '#packages', 'type' => 'internal', 'display_order' => 1],
            ['label' => 'About Guide', 'url' => '#about', 'type' => 'internal', 'display_order' => 2],
            ['label' => 'Testimonials', 'url' => '#testimonials', 'type' => 'internal', 'display_order' => 3],
            ['label' => 'Contact', 'url' => '#inquiry', 'type' => 'cta', 'display_order' => 4],
        ];

        foreach ($navLinks as $nav) {
            DB::table('navigation_items')->updateOrInsert(
                ['url' => $nav['url'], 'label' => $nav['label']],
                [
                    'type' => $nav['type'],
                    'open_new_tab' => false,
                    'is_active' => true,
                    'display_order' => $nav['display_order'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}