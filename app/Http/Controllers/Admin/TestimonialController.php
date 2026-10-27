<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimonial::orderBy('display_order', 'asc')
            ->latest('id')
            ->paginate(10);

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'review_text' => 'required|string|max:2000',
            'customer_avatar' => 'nullable|image|mimes:jpeg,png,webp,jpg|max:2048',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        if ($request->hasFile('customer_avatar')) {
            $validated['customer_avatar'] = $request->file('customer_avatar')->store('testimonials', 'public');
        }

        Testimonial::create($validated);

        return back()->with('success', 'Testimonial berhasil ditambahkan.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'review_text' => 'required|string|max:2000',
            'customer_avatar' => 'nullable|image|mimes:jpeg,png,webp,jpg|max:2048',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        if ($request->hasFile('customer_avatar')) {
            if ($testimonial->customer_avatar) {
                Storage::disk('public')->delete($testimonial->customer_avatar);
            }
            $validated['customer_avatar'] = $request->file('customer_avatar')->store('testimonials', 'public');
        } else {
            unset($validated['customer_avatar']);
        }

        $testimonial->update($validated);

        return back()->with('success', 'Testimonial berhasil diperbarui.');
    }

    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->customer_avatar) {
            Storage::disk('public')->delete($testimonial->customer_avatar);
        }

        $testimonial->delete();

        return back()->with('success', 'Testimonial dihapus.');
    }
}