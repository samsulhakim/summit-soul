<?php

use App\Http\Controllers\Admin\AppearanceController;
use App\Http\Controllers\Admin\BookingInquiryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\HikingPackageController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PreviewController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\LocaleController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'index'])->name('home');
Route::post('/locale/{locale}', [LocaleController::class, 'update'])
    ->whereIn('locale', ['en', 'id'])
    ->name('locale.update');
Route::post('/inquiry', [PublicController::class, 'submitInquiry'])->name('public.inquiry.submit');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.post');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/pages/home', fn () => to_route('admin.appearance'))->name('pages.home');

        Route::get('/appearance', [AppearanceController::class, 'index'])->name('appearance');
        Route::put('/appearance/draft', [AppearanceController::class, 'updateDraft'])->name('appearance.update_draft');
        Route::post('/appearance/publish', [AppearanceController::class, 'publish'])->name('appearance.publish');

        Route::resource('packages', HikingPackageController::class);

        Route::get('/inquiries', [BookingInquiryController::class, 'index'])->name('inquiries.index');
        Route::get('/inquiries/{inquiry}', [BookingInquiryController::class, 'show'])->name('inquiries.show');
        Route::patch('/inquiries/{inquiry}/status', [BookingInquiryController::class, 'updateStatus'])->name('inquiries.update_status');
        Route::post('/inquiries/{inquiry}/notes', [BookingInquiryController::class, 'saveNotes'])->name('inquiries.notes');

        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        Route::get('/preview', [PreviewController::class, 'frame'])->name('preview');
        Route::get('/preview/render', [PreviewController::class, 'renderDraft'])->name('preview.render');

        Route::resource('media', MediaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('testimonials', TestimonialController::class)->except(['create', 'edit', 'show']);
        Route::resource('faqs', FaqController::class)->except(['create', 'edit', 'show']);

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    });
});

Route::get('/admin/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'admin'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
