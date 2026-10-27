<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HomePageData;
use Inertia\Inertia;
use Inertia\Response;

class PreviewController extends Controller
{
    /**
     * Frame pembungkus preview dengan kontrol viewport (Desktop, Tablet, Mobile)
     */
    public function frame(): Response
    {
        return Inertia::render('Admin/Preview/Frame');
    }

    /**
     * Render konten website menggunakan data DRAFT
     */
    public function renderDraft(HomePageData $homePageData): Response
    {
        return Inertia::render('Public/Home', $homePageData->build(draft: true));
    }
}
