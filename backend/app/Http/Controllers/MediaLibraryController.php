<?php

namespace App\Http\Controllers;

use App\Models\MediaLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaLibraryController extends Controller
{
    /**
     * Display a listing of media files
     */
    public function index(Request $request)
    {
        $query = MediaLibrary::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $media = $query->orderBy('created_at', 'desc')->get();

        return response()->json($media);
    }

    /**
     * Store a newly uploaded file
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|image|max:10240', // 10MB max
            'category' => 'nullable|in:service,banner,gallery,staff,product,hero,category,other',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('media', $filename, 'public');

        $media = MediaLibrary::create([
            'name' => $file->getClientOriginalName(),
            'file_path' => '/storage/' . $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'category' => $validated['category'] ?? 'other',
            'alt_text' => $validated['alt_text'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json($media, 201);
    }

    /**
     * Store base64 encoded image
     */
    public function storeBase64(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|string',
            'name' => 'required|string|max:255',
            'category' => 'nullable|in:service,banner,gallery,staff,product,hero,category,other',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Decode base64 image
        $imageData = $validated['image'];
        
        // Check if it's a data URL
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $type = strtolower($type[1]);
            
            $imageData = base64_decode($imageData);
            
            if ($imageData === false) {
                return response()->json(['error' => 'Invalid base64 string'], 400);
            }
            
            $filename = Str::uuid() . '.' . $type;
            Storage::disk('public')->put('media/' . $filename, $imageData);
            
            $media = MediaLibrary::create([
                'name' => $validated['name'],
                'file_path' => '/storage/media/' . $filename,
                'file_type' => 'image/' . $type,
                'file_size' => strlen($imageData),
                'category' => $validated['category'] ?? 'other',
                'alt_text' => $validated['alt_text'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);
            
            return response()->json($media, 201);
        }
        
        return response()->json(['error' => 'Invalid image format'], 400);
    }

    /**
     * Update the specified media
     */
    public function update(Request $request, MediaLibrary $media)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'category' => 'in:service,banner,gallery,staff,product,hero,category,other',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $media->update($validated);

        return response()->json($media);
    }

    /**
     * Remove the specified media
     */
    public function destroy(MediaLibrary $media)
    {
        // Delete file from storage
        $filePath = str_replace('/storage/', '', $media->file_path);
        Storage::disk('public')->delete($filePath);

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
