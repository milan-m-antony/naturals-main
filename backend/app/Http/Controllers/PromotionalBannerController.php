<?php

namespace App\Http\Controllers;

use App\Models\PromotionalBanner;
use Illuminate\Http\Request;

class PromotionalBannerController extends Controller
{
    /**
     * Display a listing of promotional banners
     */
    public function index()
    {
        $banners = PromotionalBanner::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($banners);
    }

    /**
     * Store a newly created banner
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'bg_color' => 'nullable|string|max:7',
            'text_color' => 'nullable|string|max:7',
            'bg_image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $banner = PromotionalBanner::create($validated);

        return response()->json($banner, 201);
    }

    /**
     * Update the specified banner
     */
    public function update(Request $request, PromotionalBanner $banner)
    {
        $validated = $request->validate([
            'tag' => 'nullable|string|max:255',
            'title' => 'string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'bg_color' => 'nullable|string|max:7',
            'text_color' => 'nullable|string|max:7',
            'bg_image' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $banner->update($validated);

        return response()->json($banner);
    }

    /**
     * Remove the specified banner
     */
    public function destroy(PromotionalBanner $banner)
    {
        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }
}
