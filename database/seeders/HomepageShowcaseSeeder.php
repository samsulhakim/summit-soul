<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\HikingPackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HomepageShowcaseSeeder extends Seeder
{
    public function run(): void
    {
        $hero = DB::table('page_sections')
            ->where('page_slug', 'home')
            ->where('section_key', 'hero')
            ->first();

        if (! $hero) {
            $this->createSection('hero', 'A different way to find the summit', [
                'eyebrow' => 'PRIVATE HIKING & MOUNTAIN EXPEDITIONS',
                'headline' => 'Discover the Mountains. Experience the Extraordinary.',
                'description' => 'Explore Indonesia’s breathtaking landscapes with a dedicated local hiking guide. Thoughtfully planned adventures, meaningful connections, and unforgettable journeys.',
                'primary_cta_label' => 'Explore Adventures',
                'primary_cta_url' => '#packages',
                'secondary_cta_label' => 'Meet Your Guide',
                'secondary_cta_url' => '#about',
                'background_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=88',
            ], 1);
        } else {
            $content = json_decode($hero->content_published ?? '', true) ?: [];

            if (($content['headline'] ?? null) === 'Conquer High Altitudes with Absolute Mastery') {
                $content = [
                    ...$content,
                    'eyebrow' => 'PRIVATE HIKING & MOUNTAIN EXPEDITIONS',
                    'headline' => 'Discover the Mountains. Experience the Extraordinary.',
                    'description' => 'Explore Indonesia’s breathtaking landscapes with a dedicated local hiking guide. Thoughtfully planned adventures, meaningful connections, and unforgettable journeys.',
                    'primary_cta_label' => 'Explore Adventures',
                    'secondary_cta_label' => 'Meet Your Guide',
                    'background_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=88',
                ];

                DB::table('page_sections')->where('id', $hero->id)->update([
                    'content_published' => json_encode($content),
                    'content_draft' => json_encode($content),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->createSection('about_guide', 'Meet your local guide', [
            'eyebrow' => 'ABOUT THE GUIDE',
            'heading' => 'More Than a Guide, A Local Friend.',
            'description' => 'Get to know Indonesia beyond the trail. Your local guide brings thoughtful planning, personal attention, and a deep respect for the landscapes and communities you visit.',
            'image' => 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=85',
            'guide_name' => 'Chief Mountain Guide',
            'location' => 'East Java, Indonesia',
            'credentials' => [
                'Safety-conscious expedition planning',
                'Local knowledge in English and Bahasa Indonesia',
                'Thoughtful pacing for every group',
                'Respect for local culture and nature',
            ],
        ], 2);

        $this->createSection('highlights', 'The Summit Soul difference', [
            'items' => [
                ['title' => 'Local Expert Guide', 'description' => 'Rooted in the landscapes we explore'],
                ['title' => 'Safe & Comfortable', 'description' => 'Thoughtful planning at every step'],
                ['title' => 'Customizable Itineraries', 'description' => 'Your pace, your preferences'],
                ['title' => 'Sustainable Travel', 'description' => 'Support for local communities'],
            ],
        ], 3);

        $this->createSection('gallery', 'Moments from the trail', [
            'eyebrow' => 'OUR GALLERY',
            'heading' => 'Small Adventures. Unforgettable Memories.',
            'description' => 'A glimpse of the landscapes, people, and moments that make every journey special.',
            'images' => [
                ['src' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', 'alt' => 'Hikers exploring an open mountain landscape'],
                ['src' => 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85', 'alt' => 'Mountain range beneath a clear sky'],
                ['src' => 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85', 'alt' => 'Sunrise over a quiet mountain lake'],
                ['src' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85', 'alt' => 'Mountain peaks in the morning light'],
                ['src' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85', 'alt' => 'Alpine lake surrounded by mountains'],
                ['src' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', 'alt' => 'Mountain peak under a starry sky'],
            ],
        ], 4);

        $this->createSection('experience', 'The journey matters', [
            'eyebrow' => 'WHY TRAVEL WITH US',
            'heading' => 'More Than Just a Hike, It’s a Life Experience.',
            'description' => 'Take the time to connect with the people, places, and landscapes along the way.',
            'benefits' => [
                'Expert Guidance & Safety',
                'Authentic Local Experiences',
                'Small Groups & Personal Service',
                'Sustainable Travel',
            ],
        ], 5);

        $this->syncDefaultNavigation();
        $this->createDefaultPackages();
        $this->createDefaultFaqs();
    }

    private function createSection(string $key, string $title, array $content, int $order): void
    {
        $exists = DB::table('page_sections')
            ->where('page_slug', 'home')
            ->where('section_key', $key)
            ->exists();

        if ($exists) {
            return;
        }

        DB::table('page_sections')->insert([
            'page_slug' => 'home',
            'section_key' => $key,
            'title' => $title,
            'is_visible' => true,
            'display_order' => $order,
            'content_published' => json_encode($content),
            'content_draft' => json_encode($content),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function syncDefaultNavigation(): void
    {
        DB::table('navigation_items')->where('url', '#packages')->update(['label' => 'Packages']);
        DB::table('navigation_items')->where('url', '#about')->update(['label' => 'About']);
        DB::table('navigation_items')->where('url', '#inquiry')->update([
            'label' => 'Contact',
            'url' => '#contact',
            'type' => 'cta',
        ]);

        $links = [
            ['Home', '#home', 'internal', 1],
            ['About', '#about', 'internal', 2],
            ['Packages', '#packages', 'internal', 3],
            ['Gallery', '#gallery', 'internal', 4],
            ['Testimonials', '#testimonials', 'internal', 5],
            ['FAQ', '#faq', 'internal', 6],
            ['Contact', '#contact', 'cta', 7],
        ];

        foreach ($links as [$label, $url, $type, $order]) {
            DB::table('navigation_items')->updateOrInsert(
                ['url' => $url],
                [
                    'label' => $label,
                    'type' => $type,
                    'open_new_tab' => false,
                    'is_active' => true,
                    'display_order' => $order,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    private function createDefaultPackages(): void
    {
        $packages = [
            [
                'title' => 'Mount Bromo Adventure',
                'slug' => 'mount-bromo-adventure',
                'destination' => 'Mount Bromo, East Java',
                'duration' => '2 Days 1 Night',
                'difficulty_level' => 'Moderate',
                'price' => 150,
                'currency' => 'USD',
                'price_unit' => 'per_person',
                'short_description' => 'Watch first light spill across the volcanic landscape on a guided sunrise journey.',
                'full_description' => '<p>Explore the dramatic scenery of Mount Bromo with a local guide. The itinerary can be adjusted to your group and conditions.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
                'included_services' => ['Local guide', 'Route planning', 'Small-group experience'],
                'is_featured' => true,
            ],
            [
                'title' => 'Mount Rinjani Summit',
                'slug' => 'mount-rinjani-summit',
                'destination' => 'Mount Rinjani, Lombok',
                'duration' => '3 Days 2 Nights',
                'difficulty_level' => 'Challenging',
                'price' => 350,
                'currency' => 'USD',
                'price_unit' => 'per_person',
                'short_description' => 'A rewarding highland route through forest, crater scenery, and open mountain views.',
                'full_description' => '<p>Discover the landscapes of Mount Rinjani with a locally guided itinerary planned around your group and current trail conditions.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=85',
                'included_services' => ['Local guide', 'Route planning', 'Small-group experience'],
                'is_featured' => true,
            ],
            [
                'title' => 'Ijen Crater Exploration',
                'slug' => 'ijen-crater-exploration',
                'destination' => 'Ijen, East Java',
                'duration' => '2 Days 1 Night',
                'difficulty_level' => 'Moderate',
                'price' => 200,
                'currency' => 'USD',
                'price_unit' => 'per_person',
                'short_description' => 'Experience Ijen’s striking volcanic scenery with a guide who knows the region.',
                'full_description' => '<p>Explore the Ijen area at a considered pace, with route details adapted to local conditions.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85',
                'included_services' => ['Local guide', 'Route planning', 'Small-group experience'],
                'is_featured' => true,
            ],
            [
                'title' => 'Custom Adventure',
                'slug' => 'custom-adventure',
                'destination' => 'Indonesia',
                'duration' => 'Flexible Duration',
                'difficulty_level' => 'Moderate',
                'price' => 0,
                'currency' => 'USD',
                'price_unit' => 'per_group',
                'short_description' => 'Build a private itinerary around your interests, available time, and preferred pace.',
                'full_description' => '<p>Tell us what you have in mind and we can discuss a route and schedule that suit your group.</p>',
                'featured_image' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=85',
                'included_services' => ['Custom itinerary', 'Private consultation', 'Flexible pace'],
                'is_featured' => true,
            ],
        ];

        foreach ($packages as $package) {
            HikingPackage::firstOrCreate(
                ['slug' => $package['slug']],
                [...$package, 'status' => 'published']
            );
        }
    }

    private function createDefaultFaqs(): void
    {
        $faqs = [
            [
                'question' => 'What should I bring for a hiking trip?',
                'answer' => 'Your guide will share a route-specific packing list before your trip. Comfortable hiking footwear, weather-appropriate layers, and a reusable water bottle are good starting points.',
            ],
            [
                'question' => 'Do I need prior hiking experience?',
                'answer' => 'It depends on the route. Share your experience and fitness level when you inquire so we can help you choose an appropriate adventure.',
            ],
            [
                'question' => 'Can the itinerary be customized?',
                'answer' => 'Yes. Use the inquiry form to tell us your preferred dates, group size, interests, and pace, and we can discuss options.',
            ],
            [
                'question' => 'How do you handle changing weather conditions?',
                'answer' => 'Routes and timing are planned with local conditions in mind. Your guide will discuss the available options if conditions change.',
            ],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::firstOrCreate(
                ['question' => $faq['question']],
                [...$faq, 'is_published' => true, 'display_order' => $index + 1]
            );
        }
    }
}
