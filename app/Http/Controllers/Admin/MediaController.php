<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MediaAsset::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('alt_text', 'like', '%' . $request->search . '%')
                  ->orWhere('caption', 'like', '%' . $request->search . '%')
                  ->orWhere('file_name', 'like', '%' . $request->search . '%');
            });
        }

        $media = $query->orderBy('display_order', 'asc')
            ->latest('id')
            ->paginate(18)
            ->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|image|mimes:jpeg,png,webp,jpg|max:5120',
            'category' => 'required|string|in:expedition,summits,camps,guides',
        ]);

        foreach ($request->file('files') as $file) {
            $path = $file->store('gallery', 'public');

            MediaAsset::create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'category' => $request->category,
                'alt_text' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            ]);
        }

        return back()->with('success', 'Gambar berhasil diunggah ke pustaka media.');
    }

    public function update(Request $request, MediaAsset $medium)
    {
        $validated = $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
            'category' => 'required|string|in:expedition,summits,camps,guides',
            'is_featured' => 'boolean',
        ]);

        $medium->update($validated);

        return back()->with('success', 'Metadata gambar diperbarui.');
    }

    public function destroy(MediaAsset $medium)
    {
        if (Storage::disk('public')->exists($medium->file_path)) {
            Storage::disk('public')->delete($medium->file_path);
        }

        $medium->delete();

        return back()->with('success', 'Gambar berhasil dihapus permanen.');
    }
}