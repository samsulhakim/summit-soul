<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class LocaleController extends Controller
{
    public function update(string $locale): RedirectResponse
    {
        abort_unless(in_array($locale, ['en', 'id'], true), 404);

        session(['locale' => $locale]);

        return back();
    }
}
