<?php

use App\Models\User;
use Database\Seeders\HomepageShowcaseSeeder;
use Database\Seeders\SummitSoulDefaultSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

it('saves the homepage background as a draft and publishes it', function () {
    $this->seed(SummitSoulDefaultSeeder::class);
    $this->seed(HomepageShowcaseSeeder::class);
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->forceFill(['is_admin' => true])->save();
    $publishedBackground = json_decode(
        DB::table('page_sections')->where('section_key', 'hero')->value('content_published'),
        true
    )['background_image'];

    $this->actingAs($admin)
        ->get(route('admin.appearance'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('heroContent.background_image', $publishedBackground));

    $this->actingAs($admin)
        ->from(route('admin.appearance'))
        ->post(route('admin.appearance.update_draft'), [
            '_method' => 'put',
            'themeColors' => [
                'primary_color' => '#14251F',
                'secondary_color' => '#F1EBDD',
                'accent_color' => '#D7B77A',
                'dark_bg' => '#242820',
                'main_text' => '#F1EBDD',
            ],
            'typography' => [
                'heading_font' => 'Playfair Display',
                'body_font' => 'Inter',
                'heading_size_preset' => 'large',
                'body_size_preset' => 'regular',
            ],
            'heroLayout' => [
                'desktop_height' => 'screen',
                'mobile_height' => 'large',
                'content_alignment' => 'left',
                'mobile_text_alignment' => 'center',
                'container_width' => 'wide',
            ],
            'heroBackground' => UploadedFile::fake()->image('homepage-background.jpg'),
        ])
        ->assertRedirect(route('admin.appearance'))
        ->assertSessionHasNoErrors();

    $hero = DB::table('page_sections')->where('section_key', 'hero')->first();
    $draftContent = json_decode($hero->content_draft, true);

    expect($draftContent['background_image'])->toStartWith('hero/')
        ->and($draftContent['headline'])->toBe('Discover the Mountains. Experience the Extraordinary.')
        ->and(json_decode($hero->content_published, true)['background_image'])->toBe($publishedBackground);

    Storage::disk('public')->assertExists($draftContent['background_image']);

    $this->post(route('admin.appearance.publish'))->assertRedirect();

    expect(json_decode(
        DB::table('page_sections')->where('section_key', 'hero')->value('content_published'),
        true
    )['background_image'])->toBe($draftContent['background_image']);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('hero.content.background_image', $draftContent['background_image']));
});

it('rejects invalid homepage background uploads', function () {
    $this->seed(SummitSoulDefaultSeeder::class);
    $this->seed(HomepageShowcaseSeeder::class);

    $admin = User::factory()->create();
    $admin->forceFill(['is_admin' => true])->save();
    $originalDraft = DB::table('page_sections')->where('section_key', 'hero')->value('content_draft');

    $this->actingAs($admin)
        ->from(route('admin.appearance'))
        ->post(route('admin.appearance.update_draft'), [
            '_method' => 'put',
            'themeColors' => [
                'primary_color' => '#14251F',
                'secondary_color' => '#F1EBDD',
                'accent_color' => '#D7B77A',
                'dark_bg' => '#242820',
                'main_text' => '#F1EBDD',
            ],
            'typography' => [
                'heading_font' => 'Playfair Display',
                'body_font' => 'Inter',
                'heading_size_preset' => 'large',
                'body_size_preset' => 'regular',
            ],
            'heroLayout' => [
                'desktop_height' => 'screen',
                'mobile_height' => 'large',
                'content_alignment' => 'left',
                'mobile_text_alignment' => 'center',
                'container_width' => 'wide',
            ],
            'heroBackground' => UploadedFile::fake()->create('not-an-image.txt', 10, 'text/plain'),
        ])
        ->assertSessionHasErrors('heroBackground');

    expect(DB::table('page_sections')->where('section_key', 'hero')->value('content_draft'))->toBe($originalDraft);
});
