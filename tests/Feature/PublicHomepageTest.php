<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the published homepage with its showcase content', function () {
    $this->seed(HomepageShowcaseSeeder::class);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('hero.content.headline', 'Discover the Mountains. Experience the Extraordinary.')
            ->has('sections.about_guide.content.credentials', 4)
            ->has('packages', 4)
            ->has('faqs', 4)
            ->has('navigation', 7));
});

it('persists the selected locale and shares it with the homepage', function () {
    $this->from('/')
        ->post(route('locale.update', ['locale' => 'id']))
        ->assertRedirect('/')
        ->assertSessionHas('locale', 'id');

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('locale', 'id'));
});

it('rejects locale values outside the supported languages', function () {
    $this->post('/locale/fr')->assertNotFound();

    $this->withSession(['locale' => 'fr'])
        ->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('locale', 'en'));
});

it('renders draft homepage content in the authenticated preview', function () {
    $this->seed(HomepageShowcaseSeeder::class);

    DB::table('page_sections')
        ->where('page_slug', 'home')
        ->where('section_key', 'hero')
        ->update(['content_draft' => json_encode(['headline' => 'Draft expedition headline'])]);

    $admin = User::factory()->create();
    $admin->forceFill(['is_admin' => true])->save();

    $this->actingAs($admin)
        ->get(route('admin.preview.render'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->where('isPreviewMode', true)
            ->where('hero.content.headline', 'Draft expedition headline')
            ->has('packages', 4));
});
