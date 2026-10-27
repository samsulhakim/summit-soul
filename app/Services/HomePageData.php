<?php

namespace App\Services;

use App\Models\Faq;
use App\Models\HikingPackage;
use App\Models\MediaAsset;
use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HomePageData
{
    public function build(bool $draft = false): array
    {
        $settings = DB::table('site_settings')
            ->whereIn('key', ['theme_colors', 'typography', 'brand_identity', 'contact_information', 'seo_general'])
            ->get()
            ->keyBy('key');

        $sections = DB::table('page_sections')
            ->where('page_slug', 'home')
            ->get()
            ->mapWithKeys(fn (object $section): array => [
                $section->section_key => [
                    'title' => $section->title,
                    'is_visible' => (bool) $section->is_visible,
                    'content' => $this->decode($draft
                        ? ($section->content_draft ?: $section->content_published)
                        : $section->content_published),
                    'layout' => $this->decode($draft
                        ? ($section->layout_draft ?: $section->layout_published)
                        : $section->layout_published),
                ],
            ]);

        $value = function (string $key) use ($settings, $draft): array {
            $setting = $settings->get($key);

            return $this->decode($setting
                ? ($draft ? ($setting->value_draft ?: $setting->value_published) : $setting->value_published)
                : null);
        };

        $hero = $sections->get('hero', []);

        return [
            'theme' => [
                'colors' => $value('theme_colors'),
                'typography' => $value('typography'),
                'brand' => $value('brand_identity'),
                'contact' => $value('contact_information'),
                'seo' => $value('seo_general'),
            ],
            'hero' => [
                'content' => $hero['content'] ?? [],
                'layout' => $hero['layout'] ?? [],
                'is_visible' => $hero['is_visible'] ?? true,
            ],
            'sections' => $sections->all(),
            'galleryMedia' => MediaAsset::query()
                ->where('is_featured', true)
                ->orderBy('display_order')
                ->latest('id')
                ->limit(6)
                ->get(['file_path', 'alt_text', 'caption'])
                ->map(fn (MediaAsset $media): array => [
                    'src' => Storage::disk('public')->url($media->file_path),
                    'alt' => $media->alt_text ?: $media->caption ?: 'Summit Soul expedition',
                ]),
            'packages' => HikingPackage::query()
                ->when(! $draft, fn ($query) => $query->where('status', 'published'))
                ->orderByDesc('is_featured')
                ->orderBy('display_order')
                ->limit(8)
                ->get(),
            'navigation' => DB::table('navigation_items')
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get(),
            'testimonials' => Testimonial::query()
                ->when(! $draft, fn ($query) => $query->where('is_published', true))
                ->orderByDesc('is_featured')
                ->orderBy('display_order')
                ->limit(3)
                ->get(),
            'faqs' => Faq::query()
                ->when(! $draft, fn ($query) => $query->where('is_published', true))
                ->orderBy('display_order')
                ->limit(8)
                ->get(),
            'isPreviewMode' => $draft,
        ];
    }

    private function decode(?string $value): array
    {
        if (! $value) {
            return [];
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }
}
