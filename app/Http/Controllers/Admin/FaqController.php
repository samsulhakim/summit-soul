<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::orderBy('display_order', 'asc')
            ->latest('id')
            ->paginate(15);

        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string|max:3000',
            'is_published' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        Faq::create($validated);

        return back()->with('success', 'Pertanyaan FAQ berhasil dibuat.');
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string|max:3000',
            'is_published' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        $faq->update($validated);

        return back()->with('success', 'Pertanyaan FAQ berhasil diperbarui.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return back()->with('success', 'FAQ berhasil dihapus.');
    }
}