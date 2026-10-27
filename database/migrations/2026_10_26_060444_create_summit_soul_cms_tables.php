<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Settings (Brand, Theme, Colors, Typography, SEO, Contact)
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->index(); // 'appearance', 'brand', 'contact', 'seo'
            $table->string('key')->unique();
            $table->json('value_published')->nullable();
            $table->json('value_draft')->nullable();
            $table->timestamps();
        });

        // 2. Page Sections (Hero, About Guide, Trust Indicators, Footer)
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug')->default('home')->index();
            $table->string('section_key')->index(); // 'hero', 'about_guide', 'highlights', dll
            $table->string('title')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('display_order')->default(0);
            $table->json('content_published')->nullable();
            $table->json('content_draft')->nullable();
            $table->json('layout_published')->nullable(); // Konfigurasi layout desktop & mobile
            $table->json('layout_draft')->nullable();
            $table->timestamps();
        });

        // 3. Navigation Items (Header & Footer Links)
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->enum('type', ['internal', 'external', 'cta'])->default('internal');
            $table->boolean('open_new_tab')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 4. Hiking Packages
        Schema::create('hiking_packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('destination');
            $table->string('duration');
            $table->enum('difficulty_level', ['Easy', 'Moderate', 'Challenging', 'Demanding', 'Extreme'])->default('Moderate');
            $table->decimal('price', 10, 2);
            $table->string('currency', 5)->default('USD');
            $table->enum('price_unit', ['per_person', 'per_group'])->default('per_person');
            $table->integer('max_group_size')->nullable();
            $table->text('short_description');
            $table->longText('full_description')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->json('included_services')->nullable();
            $table->json('excluded_services')->nullable();
            $table->json('requirements')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 5. Testimonials
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('country')->nullable();
            $table->text('review_text');
            $table->string('customer_avatar')->nullable();
            $table->integer('rating')->default(5);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 6. FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->longText('answer');
            $table->boolean('is_published')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 7. Booking Inquiries
        Schema::create('booking_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->nullable()->constrained('hiking_packages')->nullOnDelete();
            $table->string('customer_name');
            $table->string('email');
            $table->string('phone_whatsapp')->nullable();
            $table->string('nationality')->nullable();
            $table->date('preferred_travel_date')->nullable();
            $table->integer('travelers_count')->default(1);
            $table->text('message');
            $table->text('internal_notes')->nullable();
            $table->enum('status', ['new', 'contacted', 'awaiting_confirmation', 'confirmed', 'completed', 'cancelled'])->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_inquiries');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('hiking_packages');
        Schema::dropIfExists('navigation_items');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('site_settings');
    }
};