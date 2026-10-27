<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HikingPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HikingPackageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = HikingPackage::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('destination', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $packages = $query->orderBy('display_order', 'asc')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package' => null,
            'isEdit' => false,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePackage($request);

        // Upload featured image
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('packages', 'public');
        }

        // Generate unique slug
        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (HikingPackage::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }
        $validated['slug'] = $slug;

        HikingPackage::create($validated);

        return redirect()->route('admin.packages.index')->with('success', 'Hiking package created successfully.');
    }

    public function edit(HikingPackage $package): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package' => $package,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, HikingPackage $package)
    {
        $validated = $this->validatePackage($request, $package->id);

        if ($request->hasFile('featured_image')) {
            // Hapus gambar lama jika ada
            if ($package->featured_image) {
                Storage::disk('public')->delete($package->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('packages', 'public');
        } else {
            unset($validated['featured_image']);
        }

        // Cek pembaruan slug jika judul berubah
        if ($package->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $counter = 1;
            while (HikingPackage::where('slug', $slug)->where('id', '!=', $package->id)->exists()) {
                $slug = "{$originalSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $package->update($validated);

        return redirect()->route('admin.packages.index')->with('success', 'Hiking package updated successfully.');
    }

    public function destroy(HikingPackage $package)
    {
        if ($package->featured_image) {
            Storage::disk('public')->delete($package->featured_image);
        }

        $package->delete();

        return redirect()->route('admin.packages.index')->with('success', 'Hiking package deleted safely.');
    }

    private function validatePackage(Request $request, $id = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'duration' => 'required|string|max:100',
            'difficulty_level' => 'required|in:Easy,Moderate,Challenging,Demanding,Extreme',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:5',
            'price_unit' => 'required|in:per_person,per_group',
            'max_group_size' => 'nullable|integer|min:1',
            'short_description' => 'required|string|max:500',
            'full_description' => 'nullable|string',
            'featured_image' => $id ? 'nullable|image|mimes:jpeg,png,webp,jpg|max:3072' : 'required|image|mimes:jpeg,png,webp,jpg|max:3072',
            'included_services' => 'nullable|array',
            'included_services.*' => 'string|max:255',
            'excluded_services' => 'nullable|array',
            'excluded_services.*' => 'string|max:255',
            'requirements' => 'nullable|array',
            'requirements.*' => 'string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'status' => 'required|in:draft,published',
            'display_order' => 'integer|min:0',
        ]);
    }
}